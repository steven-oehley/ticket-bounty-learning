# Authentication System - Complete Guide

This document provides an in-depth explanation of the authentication system used in this project. It is designed for developers who may be new to authentication concepts and want to understand how secure user sessions work in a modern Next.js application.

## Table of Contents

1. [Introduction: What is Authentication?](#1-introduction-what-is-authentication)
2. [Authentication vs Authorization](#2-authentication-vs-authorization)
3. [Session-Based vs Token-Based Auth](#3-session-based-vs-token-based-auth)
4. [Database Schema](#4-database-schema)
5. [Password Security](#5-password-security)
6. [Session Token Security](#6-session-token-security)
7. [Cookie Security](#7-cookie-security)
8. [The Sliding Window Pattern](#8-the-sliding-window-pattern)
9. [Project File Structure](#9-project-file-structure)
10. [Authentication Flow: Sign Up](#10-authentication-flow-sign-up)
11. [Authentication Flow: Sign In](#11-authentication-flow-sign-in)
12. [Authentication Flow: Sign Out](#12-authentication-flow-sign-out)
13. [Session Validation on Every Request](#13-session-validation-on-every-request)
14. [getAuth vs getAuthOrRedirect](#14-getauth-vs-getauthorredirect)
15. [Client Components and the useAuth Hook](#15-client-components-and-the-useauth-hook)
16. [The Header Pattern: Avoiding Dynamic Rendering](#16-the-header-pattern-avoiding-dynamic-rendering)
17. [Authorization: Protecting Resources](#17-authorization-protecting-resources)
18. [Form Validation with Zod](#18-form-validation-with-zod)
19. [Security Best Practices Summary](#19-security-best-practices-summary)
20. [Common Attack Vectors and How We Prevent Them](#20-common-attack-vectors-and-how-we-prevent-them)

---

## 1. Introduction: What is Authentication?

**Authentication** answers the question: "Who are you?"

When a user visits your application, you need to know if they're a registered user and which specific user they are. This allows you to:

- Show personalized content
- Protect private data
- Track user actions
- Control access to features

This project uses **session-based authentication**, where:

1. User proves identity (email + password)
2. Server creates a "session" and gives user a "session token"
3. User sends this token with every request
4. Server looks up the token to know who the user is

---

## 2. Authentication vs Authorization

These terms are often confused:

| Concept            | Question           | Example                         |
| ------------------ | ------------------ | ------------------------------- |
| **Authentication** | "Who are you?"     | Verifying email/password        |
| **Authorization**  | "What can you do?" | Can this user edit this ticket? |

In this project:

- **Authentication**: `getAuth()`, `signIn()`, `signUp()`
- **Authorization**: `isTicketOwner()`, checking if user owns a resource

```
User logs in (Authentication)
        ↓
User tries to edit ticket #123
        ↓
System checks: Does user own ticket #123? (Authorization)
        ↓
Allow or deny the action
```

---

## 3. Session-Based vs Token-Based Auth

There are two main approaches to authentication:

### Session-Based (What We Use)

```
┌─────────┐         ┌─────────┐         ┌──────────┐
│ Browser │ ──1──→  │ Server  │ ──2──→  │ Database │
│         │ ←──4──  │         │ ←──3──  │          │
└─────────┘         └─────────┘         └──────────┘

1. Browser sends session token (cookie)
2. Server queries database for session
3. Database returns session + user data
4. Server sends response
```

**Pros:**

- Sessions can be invalidated instantly (logout everywhere)
- No complex token refresh logic
- Session data stored server-side (more secure)

**Cons:**

- Requires database lookup on every request
- More server load

### Token-Based (JWT - Not Used Here)

```
┌─────────┐         ┌─────────┐
│ Browser │ ──1──→  │ Server  │
│         │ ←──2──  │         │
└─────────┘         └─────────┘

1. Browser sends JWT token
2. Server validates signature (no DB needed)
```

**Pros:**

- No database lookup needed
- Stateless servers

**Cons:**

- Can't invalidate tokens (must wait for expiry)
- Tokens contain user data (larger payload)
- Complex refresh token flows

**Why Session-Based for This Project:**

- Simpler mental model
- Can revoke sessions instantly
- Better security for traditional web apps

---

## 4. Database Schema

Location: `prisma/schema.prisma`

### User Model

```prisma
model User {
  id           String    @id @default(cuid())
  username     String    @unique
  email        String    @unique
  passwordHash String    // NEVER store plain passwords
  sessions     Session[] // User can have multiple sessions
  tickets      Ticket[]  // User's tickets
}
```

**Key Points:**

- `id`: Unique identifier using CUID (collision-resistant unique ID)
- `passwordHash`: We store a **hash** of the password, not the password itself
- `sessions`: One user can have multiple active sessions (phone, laptop, tablet)

### Session Model

```prisma
model Session {
  id        String   @id          // This is the HASHED token
  expiresAt DateTime              // When session expires
  userId    String                // Which user this session belongs to
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Critical Security Detail:**

The `id` field stores a **hashed version** of the session token, NOT the plain token.

```
Browser Cookie: "abc123xyz"        ← Plain token (what user has)
                    ↓ SHA-256 hash
Database ID:    "7f83b1657ff1fc..."  ← Hashed token (what we store)
```

**Why?** If an attacker dumps your database, they see hashed tokens. They cannot:

- Use these hashes directly as cookies
- Reverse the hash to get the original token
- Forge valid sessions

### Cascade Delete

```prisma
onDelete: Cascade
```

When a User is deleted:

- All their Sessions are automatically deleted
- All their Tickets are automatically deleted

This prevents orphaned records and maintains data integrity.

---

## 5. Password Security

Location: `src/features/password/utils/hash-and-verify.ts`

### Why Hash Passwords?

**Never store plain-text passwords.** If your database is breached:

| Storage Method | Attacker Sees               | Result                |
| -------------- | --------------------------- | --------------------- |
| Plain text     | `password123`               | Attacker has password |
| Hashed         | `$argon2id$v=19$m=19456...` | Useless to attacker   |

### Argon2id: The Algorithm

We use **Argon2id**, winner of the Password Hashing Competition (2015).

```typescript
export const hashPassword = async (password: string) => {
  return await hash(password, {
    memoryCost: 19456, // ~19MB of RAM
    timeCost: 2, // 2 iterations
    outputLen: 32, // 256-bit output
    parallelism: 1, // Single-threaded
  });
};
```

**Why These Settings?**

| Parameter     | Value    | Purpose                                                         |
| ------------- | -------- | --------------------------------------------------------------- |
| `memoryCost`  | 19456 KB | Makes GPU attacks expensive (GPUs have limited memory per core) |
| `timeCost`    | 2        | Number of iterations (OWASP minimum)                            |
| `outputLen`   | 32       | 256-bit cryptographic strength                                  |
| `parallelism` | 1        | Single thread per hash                                          |

**The Result:**

- Hashing takes ~100-200ms per password
- An attacker trying billions of passwords would take centuries
- Your legitimate users experience imperceptible delay

### Password Verification

```typescript
export const verifyPasswordHash = async (passwordHash: string, password: string) => {
  return await verify(passwordHash, password);
};
```

**How Verification Works:**

1. Extract salt and parameters from stored hash
2. Hash the input password with same parameters
3. Compare using **constant-time comparison**

**Constant-Time Comparison:**

```
Regular comparison (===):
  "password" vs "pazzzzzz"
  ✓ p == p
  ✓ a == a
  ✗ s != z → STOP (fast rejection)

Constant-time comparison:
  "password" vs "pazzzzzz"
  Compares ALL characters in same time
  Attacker can't guess characters by measuring response time
```

---

## 6. Session Token Security

Location: `src/utils/crypto.ts`

### Token Generation

```typescript
export const generateRandomToken = () => {
  const bytes = new Uint8Array(20); // 20 bytes = 160 bits
  crypto.getRandomValues(bytes); // Cryptographically secure
  return encodeBase32LowerCaseNoPadding(bytes);
};
```

**Why 20 Bytes (160 bits)?**

- 2^160 possible values
- More combinations than atoms in the universe
- Impossible to guess or brute-force

**Why Base32?**

- URL-safe (unlike Base64 which has `+` and `/`)
- Case-insensitive (no confusion between `O` and `0`)
- Example output: `k77wey6ozggqzzkq5v6n3t4cau`

### Token Hashing

```typescript
export const hashToken = (token: string) => {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
};
```

**The Security Model:**

```
Sign Up/Sign In:
┌──────────────────────────────────────────────────────────────┐
│  generateRandomToken()  →  "k77wey6ozggqzzkq5v6n3t4cau"     │
│                                      ↓                       │
│  Browser Cookie        →  "k77wey6ozggqzzkq5v6n3t4cau"      │
│                                      ↓ hashToken()           │
│  Database Session ID   →  "a1b2c3d4e5f6789..."              │
└──────────────────────────────────────────────────────────────┘

Every Request:
┌──────────────────────────────────────────────────────────────┐
│  Cookie arrives        →  "k77wey6ozggqzzkq5v6n3t4cau"      │
│                                      ↓ hashToken()           │
│  Query database with   →  "a1b2c3d4e5f6789..."              │
│  If found and valid    →  User is authenticated!            │
└──────────────────────────────────────────────────────────────┘
```

**Security Benefits:**

| Attack Scenario | Without Hashing                        | With Hashing                 |
| --------------- | -------------------------------------- | ---------------------------- |
| Database breach | Attacker has tokens, can forge cookies | Attacker has hashes, useless |
| Cookie stolen   | Attacker has token                     | Attacker has token (same)    |

Hashing protects against database breaches, the most common attack vector.

---

## 7. Cookie Security

Location: `src/features/auth/utils/session-cookie.ts`

### Setting the Session Cookie

```typescript
export const setSessionCookie = async (sessionToken: string, expiresAt: Date) => {
  (await cookies()).set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });
};
```

### Cookie Attributes Explained

#### `httpOnly: true`

```
Without httpOnly:
  Malicious script: document.cookie → "auth_session=abc123"
  Attacker steals your session!

With httpOnly:
  Malicious script: document.cookie → "" (can't see httpOnly cookies)
  Session is protected from XSS attacks
```

JavaScript **cannot** read httpOnly cookies. The cookie is only sent with HTTP requests.

#### `sameSite: 'lax'`

Protects against Cross-Site Request Forgery (CSRF):

```
sameSite: 'strict'
  - Cookie ONLY sent for same-site requests
  - Problem: Link from email to your site won't have cookie

sameSite: 'lax'
  - Cookie sent for same-site requests
  - Cookie sent for top-level navigations (clicking links)
  - Cookie NOT sent for cross-site POST requests
  - Balances security and usability

sameSite: 'none'
  - Cookie sent everywhere (dangerous!)
```

`'lax'` allows OAuth redirects to work while blocking CSRF attacks.

#### `secure: true` (Production Only)

```
With secure: true
  - Cookie ONLY sent over HTTPS
  - Prevents man-in-the-middle attacks on HTTP

In development:
  - Set to false (localhost uses HTTP)
```

#### `path: '/'`

Cookie sent with requests to **any** path on your domain:

- `/api/tickets` ✓
- `/dashboard` ✓
- `/tickets/123/edit` ✓

### Deleting the Cookie (Sign Out)

```typescript
export const deleteSessionCookie = async () => {
  (await cookies()).set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0, // Delete immediately
  });
};
```

**Why not just `cookies().delete()`?**

The browser needs matching attributes (path, secure, etc.) to find the correct cookie to delete. Setting `maxAge: 0` with the same attributes ensures deletion.

---

## 8. The Sliding Window Pattern

Location: `src/features/auth/utils/session.ts`

### The Problem

Fixed session expiration has issues:

```
Fixed 30-day expiration:
  Day 0:  User logs in
  Day 29: User is active, session about to expire
  Day 30: Session expires, user forced to login again (bad UX)
```

### The Solution: Sliding Window

```typescript
const SESSION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 15; // 15 days
const SESSION_MAX_DURATION_MS = SESSION_REFRESH_INTERVAL_MS * 2; // 30 days
```

**How It Works:**

```
Day 0:  User logs in
        └── Session expires in 30 days

Day 10: User is active
        └── Before halfway point (15 days)
        └── No extension needed

Day 16: User is active
        └── Past halfway point (15 days)
        └── Session EXTENDED to 30 days from now

Day 45: User is active again
        └── Session extended again

Result: Active users stay logged in indefinitely!
```

**Implementation:**

```typescript
// In validateSession():
if (Date.now() >= session.expiresAt.getTime() - SESSION_REFRESH_INTERVAL_MS) {
  // Past halfway point - extend session
  session.expiresAt = new Date(Date.now() + SESSION_MAX_DURATION_MS);

  await prisma.session.update({
    where: { id: sessionId },
    data: { expiresAt: session.expiresAt },
  });
}
```

**Security Benefits:**

- Active users: Great UX (never forced to re-login)
- Inactive users: Logged out after 30 days (security)
- Compromised sessions: Expire if attacker doesn't keep using them

---

## 9. Project File Structure

```
src/features/auth/
├── actions/                    # Server Actions (mutations)
│   ├── get-auth.ts            # Get current user/session
│   ├── sign-in.ts             # Login action
│   ├── sign-out.ts            # Logout action
│   └── sign-up.ts             # Registration action
│
├── components/form/            # UI Components
│   ├── sign-in-form.tsx       # Login form (Client Component)
│   └── sign-up-form.tsx       # Registration form (Client Component)
│
├── hooks/                      # React Hooks
│   └── use-auth.ts            # Client-side auth state hook
│
├── queries/                    # Server Queries (reads)
│   └── get-auth-or-redirect.ts # Auth check with redirect
│
├── schemas/                    # Validation Schemas
│   ├── common.ts              # Shared field schemas
│   └── form-schemas.ts        # Form validation schemas
│
└── utils/                      # Utility Functions
    ├── is-ticket-owner.ts     # Authorization helper
    ├── session-cookie.ts      # Cookie management
    └── session.ts             # Session CRUD operations

src/features/password/
└── utils/
    └── hash-and-verify.ts     # Password hashing (Argon2id)

src/utils/
└── crypto.ts                  # Token generation & hashing
```

---

## 10. Authentication Flow: Sign Up

Location: `src/features/auth/actions/sign-up.ts`

### Visual Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SIGN UP FLOW                                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌───────────┐
│   Browser   │    │   Server    │    │  Password   │    │  Database │
│   (Form)    │    │   Action    │    │   Utils     │    │  (Prisma) │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └─────┬─────┘
       │                  │                  │                  │
       │ 1. Submit form   │                  │                  │
       │ (username,email, │                  │                  │
       │  password)       │                  │                  │
       │─────────────────→│                  │                  │
       │                  │                  │                  │
       │                  │ 2. Validate with │                  │
       │                  │    Zod schema    │                  │
       │                  │                  │                  │
       │                  │ 3. Hash password │                  │
       │                  │─────────────────→│                  │
       │                  │                  │                  │
       │                  │←─────────────────│                  │
       │                  │   passwordHash   │                  │
       │                  │                  │                  │
       │                  │ 4. Create user   │                  │
       │                  │──────────────────────────────────────→
       │                  │                  │                  │
       │                  │ 5. Generate      │                  │
       │                  │    session token │                  │
       │                  │                  │                  │
       │                  │ 6. Create session│                  │
       │                  │   (hashed token) │                  │
       │                  │──────────────────────────────────────→
       │                  │                  │                  │
       │ 7. Set cookie    │                  │                  │
       │   (plain token)  │                  │                  │
       │←─────────────────│                  │                  │
       │                  │                  │                  │
       │ 8. Redirect to   │                  │                  │
       │    /tickets      │                  │                  │
       │←─────────────────│                  │                  │
```

### Code Walkthrough

```typescript
export const signUp = async (_actionState: ActionState, formData: FormData) => {
  // Security: Strip sensitive fields from error responses
  const strippedFormData = new FormData();
  ['username', 'email'].forEach((key) => {
    const value = formData.get(key);
    if (value) strippedFormData.append(key, value);
  });

  try {
    // 1. VALIDATE: Check form data against schema
    const result = signUpSchema.safeParse({
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (!result.success) {
      return fromErrorToActionState(result.error, strippedFormData);
    }

    // 2. HASH: Never store plain passwords
    const passwordHash = await hashPassword(result.data.password);

    // 3. CREATE USER: Store in database
    const user = await prisma.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        passwordHash,
      },
    });

    // 4. CREATE SESSION:
    const sessionToken = generateRandomToken(); // Plain token
    const session = await createSession(sessionToken, user.id); // Hashed in DB
    await setSessionCookie(sessionToken, session.expiresAt); // Plain to browser
  } catch (error) {
    return fromErrorToActionState(error, strippedFormData);
  }

  // 5. REDIRECT: Send to protected area
  redirect(ticketsPath);
};
```

---

## 11. Authentication Flow: Sign In

Location: `src/features/auth/actions/sign-in.ts`

### Visual Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SIGN IN FLOW                                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌───────────┐
│   Browser   │    │   Server    │    │  Password   │    │  Database │
│   (Form)    │    │   Action    │    │   Utils     │    │  (Prisma) │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └─────┬─────┘
       │                  │                  │                  │
       │ 1. Submit form   │                  │                  │
       │ (email,password) │                  │                  │
       │─────────────────→│                  │                  │
       │                  │                  │                  │
       │                  │ 2. Find user     │                  │
       │                  │    by email      │                  │
       │                  │──────────────────────────────────────→
       │                  │                  │                  │
       │                  │←──────────────────────────────────────
       │                  │   user record    │                  │
       │                  │   (with hash)    │                  │
       │                  │                  │                  │
       │                  │ 3. Verify        │                  │
       │                  │    password      │                  │
       │                  │─────────────────→│                  │
       │                  │                  │                  │
       │                  │←─────────────────│                  │
       │                  │   true/false     │                  │
       │                  │                  │                  │
       │                  │ 4. Create session│                  │
       │                  │──────────────────────────────────────→
       │                  │                  │                  │
       │ 5. Set cookie    │                  │                  │
       │←─────────────────│                  │                  │
       │                  │                  │                  │
       │ 6. Redirect      │                  │                  │
       │←─────────────────│                  │                  │
```

### Code Walkthrough

```typescript
export const signIn = async (_actionState: ActionState, formData: FormData) => {
  // Security: Don't include password in any error responses
  const strippedFormData = new FormData();
  strippedFormData.append('email', formData.get('email') as string);

  try {
    // 1. VALIDATE
    const result = signInSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!result.success) {
      return fromErrorToActionState(result.error, strippedFormData);
    }

    // 2. FIND USER
    const user = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    // Security: Same error message for wrong email OR password
    // (Don't reveal which one was wrong)
    if (!user) {
      return toActionState('Incorrect email or password', 'ERROR', strippedFormData);
    }

    // 3. VERIFY PASSWORD
    const passwordValid = await verifyPasswordHash(user.passwordHash, result.data.password);

    if (!passwordValid) {
      return toActionState('Incorrect email or password', 'ERROR', strippedFormData);
    }

    // 4. CREATE SESSION
    const sessionToken = generateRandomToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionCookie(sessionToken, session.expiresAt);
  } catch (error) {
    return fromErrorToActionState(error, strippedFormData);
  }

  redirect(ticketsPath);
};
```

### Security Note: Generic Error Messages

```typescript
// WRONG (reveals information):
if (!user) return toActionState('Email not found', 'ERROR');
if (!passwordValid) return toActionState('Wrong password', 'ERROR');

// RIGHT (generic message):
if (!user) return toActionState('Incorrect email or password', 'ERROR');
if (!passwordValid) return toActionState('Incorrect email or password', 'ERROR');
```

Attackers can't determine if an email exists in your system.

---

## 12. Authentication Flow: Sign Out

Location: `src/features/auth/actions/sign-out.ts`

```typescript
export const signOut = async () => {
  // 1. Get current session
  const { session } = await getAuth();

  if (!session) {
    redirect(signInPath);
  }

  // 2. Delete session from database
  // (Invalidates the session server-side)
  await invalidateSession(session.id);

  // 3. Delete cookie from browser
  // (Removes the token client-side)
  await deleteSessionCookie();

  redirect(signInPath);
};
```

**Why Both Steps?**

| Only Delete Cookie                          | Only Invalidate Session           |
| ------------------------------------------- | --------------------------------- |
| Session still valid in DB                   | Cookie still in browser           |
| If attacker has token copy, they can use it | User would still appear logged in |

Both steps ensure complete logout.

---

## 13. Session Validation on Every Request

Location: `src/features/auth/utils/session.ts`

### The `validateSession` Function

This runs on **every authenticated request**:

```typescript
export const validateSession = async (sessionToken: string) => {
  // 1. Hash the cookie token to find DB record
  const sessionId = hashToken(sessionToken);

  // 2. Look up session AND user in one query (efficient)
  const result = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true }, // JOIN - gets user in same query
  });

  // 3. No session = invalid token
  if (!result) {
    return { session: null, user: null };
  }

  const { user, ...session } = result;

  // 4. Check expiration
  if (Date.now() >= session.expiresAt.getTime()) {
    // Clean up expired session
    await prisma.session.delete({ where: { id: sessionId } });
    return { session: null, user: null };
  }

  // 5. Sliding window: extend if past halfway point
  if (Date.now() >= session.expiresAt.getTime() - SESSION_REFRESH_INTERVAL_MS) {
    session.expiresAt = new Date(Date.now() + SESSION_MAX_DURATION_MS);
    await prisma.session.update({
      where: { id: sessionId },
      data: { expiresAt: session.expiresAt },
    });
  }

  // 6. Return valid session and user
  return { session, user };
};
```

---

## 14. getAuth vs getAuthOrRedirect

### `getAuth()` - Optional Auth Check

Location: `src/features/auth/actions/get-auth.ts`

```typescript
export const getAuth = cache(async () => {
  const sessionToken = (await cookies()).get(SESSION_COOKIE_NAME)?.value ?? null;

  if (!sessionToken) {
    return { user: null, session: null }; // Not logged in (OK)
  }

  return await validateSession(sessionToken);
});
```

**Use When:**

- Auth is optional (show different UI based on login state)
- You want to check auth without forcing redirect

**Example:**

```typescript
// In a component that works for both logged-in and anonymous users
const { user } = await getAuth();

if (user) {
  // Show "Welcome, {user.username}"
} else {
  // Show "Please log in"
}
```

### React's `cache()` Function

```typescript
export const getAuth = cache(async () => { ... });
```

**What It Does:**

- Deduplicates calls within the same request
- Call `getAuth()` 10 times in your component tree = 1 database query

```
                    Request
                       │
        ┌──────────────┼──────────────┐
        │              │              │
    Component A    Component B    Component C
        │              │              │
    getAuth()      getAuth()      getAuth()
        │              │              │
        └──────────────┴──────────────┘
                       │
                 Only ONE DB query
```

### `getAuthOrRedirect()` - Required Auth Check

Location: `src/features/auth/queries/get-auth-or-redirect.ts`

```typescript
export const getAuthOrRedirect = async () => {
  const auth = await getAuth();

  if (!auth.user) {
    redirect(signInPath); // Force redirect if not logged in
  }

  return auth;
};
```

**Use When:**

- Page requires authentication
- User must be logged in to access

**Example:**

```typescript
// In a protected layout
const TicketAuthLayout = async ({ children }) => {
  await getAuthOrRedirect();  // Redirects if not logged in
  return <>{children}</>;
};
```

---

## 15. Client Components and the useAuth Hook

Location: `src/features/auth/hooks/use-auth.ts`

### The Problem

Server Components can call `getAuth()` directly, but Client Components cannot use cookies directly.

### The Solution

```typescript
'use client';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { user } = await getAuth(); // Calls server action from client
      setUser(user);
      setIsLoading(false);
    };

    getUser();
  }, [pathname]); // Re-fetch when route changes

  return { user, isLoading };
};
```

**How It Works:**

1. Client Component mounts
2. `useEffect` runs and calls `getAuth()` (Server Action)
3. Server Action reads cookies and returns user
4. Client Component updates state

**Why `pathname` Dependency?**

- Re-fetches auth when user navigates
- Catches cases where user logs in/out in another tab
- Keeps UI in sync with auth state

---

## 16. The Header Pattern: Avoiding Dynamic Rendering

Location: `src/components/header.tsx`

### The Problem

In Next.js, if a Server Component reads cookies, the entire page becomes **dynamically rendered** (can't be statically generated or cached).

```typescript
// This makes the ENTIRE page dynamic:
const Header = async () => {
  const { user } = await getAuth(); // Reads cookies
  // ...
};
```

### The Solution: Client Component Header

```typescript
'use client';

const Header = () => {
  const { user, isLoading } = useAuth();  // Client-side auth check
  const isLoggedIn = !!user;

  const navItems = isLoading ? null : (
    <div>
      <ThemeToggle />
      {isLoggedIn ? (
        <>
          <Button asChild>
            <Link href={ticketsPath}>Tickets</Link>
          </Button>
          <form action={signOut}>
            <SubmitBtn icon={<LucideLogOut />} label="Sign Out" />
          </form>
        </>
      ) : (
        <>
          <Button asChild>
            <Link href={signUpPath}>Sign Up</Link>
          </Button>
          <Button asChild>
            <Link href={signInPath}>Sign In</Link>
          </Button>
        </>
      )}
    </div>
  );

  return <nav>...</nav>;
};
```

### How This Helps

```
Server Component Header (reading cookies):
┌────────────────────────────────────────┐
│  Page renders on EVERY request         │
│  - No caching                          │
│  - No static generation                │
│  - Slower for users                    │
└────────────────────────────────────────┘

Client Component Header:
┌────────────────────────────────────────┐
│  Page CAN be static/cached             │
│  - Header hydrates on client           │
│  - Auth check happens after load       │
│  - Loading state shown briefly         │
│  - Better performance overall          │
└────────────────────────────────────────┘
```

### Trade-offs

| Approach                | Pros                           | Cons                |
| ----------------------- | ------------------------------ | ------------------- |
| Server Component Header | No loading flash, SEO-friendly | All pages dynamic   |
| Client Component Header | Pages can be static            | Brief loading state |

For most applications, the Client Component approach is better because:

- Most pages can be cached/static
- Loading state is brief (~100ms)
- User experience is still good

---

## 17. Authorization: Protecting Resources

Location: `src/features/auth/utils/is-ticket-owner.ts`

### The Function

```typescript
export const isTicketOwner = (
  authUser: AuthUser | null | undefined,
  entity: Entity | null | undefined
) => {
  if (!authUser?.id || !entity?.userId) return false;
  return authUser.id === entity.userId;
};
```

### Usage Patterns

#### Pattern 1: Page-Level Authorization

```typescript
// In edit page
const EditTicketPage = async ({ params }) => {
  const { user } = await getAuth();
  const ticket = await getTicket(params.ticketId);

  if (!isTicketOwner(user, ticket)) {
    throw new Error("You do not have permission to edit this ticket");
  }

  return <EditForm ticket={ticket} />;
};
```

#### Pattern 2: Component-Level Authorization

```typescript
// In ticket item component
const TicketItem = async ({ ticket }) => {
  const { user } = await getAuth();
  const isOwner = isTicketOwner(user, ticket);

  return (
    <Card className={isOwner ? 'border-gradient' : ''}>
      {isOwner && <Badge>You</Badge>}
      <TicketContent ticket={ticket} />
      {isOwner && <EditButton ticketId={ticket.id} />}
    </Card>
  );
};
```

#### Pattern 3: Action-Level Authorization

```typescript
// In server action
const updateTicket = async (ticketId: string, data: TicketData) => {
  const { user } = await getAuth();
  const ticket = await getTicket(ticketId);

  if (!isTicketOwner(user, ticket)) {
    throw new Error('Unauthorized');
  }

  // Proceed with update
};
```

### Authorization Layers

Always protect at **multiple layers**:

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: UI (Nice to have, but not secure)                  │
│   - Hide edit buttons from non-owners                       │
│   - Show "You" badge on own tickets                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: Page/Route (Good protection)                       │
│   - Check ownership before rendering edit form              │
│   - Redirect or show error if not owner                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Server Action (CRITICAL - must always check)       │
│   - Verify ownership before any mutation                    │
│   - This is your last line of defense                       │
│   - Attackers can bypass UI and routes                      │
└─────────────────────────────────────────────────────────────┘
```

**Never rely only on UI hiding**. Always verify in server actions.

---

## 18. Form Validation with Zod

Location: `src/features/auth/schemas/`

### Common Field Schemas

```typescript
// common.ts

export const usernameSchema = z
  .string()
  .trim()
  .min(3, 'Username must be at least 3 characters')
  .max(31, 'Username must be at most 31 characters')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, underscores, and hyphens'
  );

export const emailSchema = z.string().trim().email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(10, 'Password must be at least 10 characters')
  .max(30, 'Password must be at most 30 characters');
```

### Form Schemas

```typescript
// form-schemas.ts

export const signUpSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Attach error to this field
  });

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});
```

### Why Zod?

1. **Type Safety**: Schema generates TypeScript types
2. **Reusability**: Common schemas shared across forms
3. **Clear Errors**: User-friendly error messages
4. **Server + Client**: Same schema works everywhere

---

## 19. Security Best Practices Summary

### Password Security

| Practice                    | Implementation               |
| --------------------------- | ---------------------------- |
| Never store plain passwords | Use Argon2id hashing         |
| Strong hashing algorithm    | Argon2id with OWASP settings |
| Minimum password length     | 10 characters                |
| Constant-time comparison    | Argon2's built-in verify     |

### Session Security

| Practice                        | Implementation           |
| ------------------------------- | ------------------------ |
| Hash tokens before storing      | SHA-256 hashing          |
| Cryptographically random tokens | Web Crypto API, 160 bits |
| Session expiration              | 30-day sliding window    |
| Immediate invalidation          | Delete from DB + cookie  |

### Cookie Security

| Practice               | Implementation             |
| ---------------------- | -------------------------- |
| httpOnly               | Prevents XSS token theft   |
| sameSite: 'lax'        | CSRF protection            |
| secure (production)    | HTTPS only                 |
| Appropriate expiration | Matches session expiration |

### Error Handling

| Practice                  | Implementation                      |
| ------------------------- | ----------------------------------- |
| Generic auth errors       | "Incorrect email or password"       |
| Strip sensitive data      | Remove password from error payloads |
| No stack traces to client | Catch and transform errors          |

---

## 20. Common Attack Vectors and How We Prevent Them

### XSS (Cross-Site Scripting)

**Attack:** Inject malicious JavaScript to steal session token.

**Prevention:**

- `httpOnly` cookies - JavaScript can't read the token
- Content Security Policy (CSP) headers
- Sanitize user input

### CSRF (Cross-Site Request Forgery)

**Attack:** Trick user into making unwanted requests.

```html
<!-- Malicious site -->
<form action="https://yourapp.com/api/transfer" method="POST">
  <input name="amount" value="1000" />
  <input name="to" value="attacker" />
</form>
<script>
  document.forms[0].submit();
</script>
```

**Prevention:**

- `sameSite: 'lax'` - Cookie not sent with cross-site POST
- Server Actions have built-in CSRF protection

### Session Fixation

**Attack:** Attacker sets a known session ID, then tricks user into using it.

**Prevention:**

- Generate new session on every login (never accept session ID from client)
- Sessions are server-generated, not client-provided

### Timing Attacks

**Attack:** Measure response time to guess password characters.

**Prevention:**

- Argon2's constant-time comparison
- Same response time for wrong email vs wrong password

### Database Breach

**Attack:** Attacker dumps your database.

**Prevention:**

- Password hashes are computationally expensive to crack
- Session IDs are hashed - can't forge valid cookies
- No sensitive data stored in plain text

### Brute Force

**Attack:** Try many passwords until one works.

**Prevention:**

- Argon2id is slow by design (~100-200ms per attempt)
- Rate limiting (implement separately)
- Account lockout after failed attempts (implement separately)

---

## Quick Reference

### When to use each function:

| Function              | Use Case                                 |
| --------------------- | ---------------------------------------- |
| `getAuth()`           | Optional auth check, get current user    |
| `getAuthOrRedirect()` | Require auth, redirect if not logged in  |
| `useAuth()`           | Auth in Client Components                |
| `isTicketOwner()`     | Check resource ownership (authorization) |
| `signIn()`            | Server Action for login form             |
| `signUp()`            | Server Action for registration form      |
| `signOut()`           | Server Action for logout                 |

### Files to modify for common tasks:

| Task                         | File(s)                             |
| ---------------------------- | ----------------------------------- |
| Change session duration      | `session.ts` (constants)            |
| Change cookie name           | `session-cookie.ts`                 |
| Add fields to user           | `schema.prisma` + sign-up action    |
| Change password requirements | `common.ts` (passwordSchema)        |
| Add new protected route      | Use `getAuthOrRedirect()` in layout |

---

## Conclusion

This authentication system provides:

1. **Security**: Hashed passwords, hashed session tokens, secure cookies
2. **Good UX**: Sliding window keeps active users logged in
3. **Performance**: Request deduplication with React's `cache()`
4. **Flexibility**: Works in Server Components, Client Components, and Server Actions
5. **Next.js Optimization**: Client Component header preserves static rendering

The patterns here follow industry best practices and can be extended for more complex requirements like OAuth, multi-factor authentication, or role-based access control.

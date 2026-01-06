// =============================================================================
// PURPOSE: Session management - create, validate, invalidate sessions
// =============================================================================

import { prisma } from '@/lib/prisma';
import { hashToken } from '@/utils/crypto';

// =============================================================================
// SESSION TIMING CONFIGURATION
// =============================================================================
/**
 * SLIDING WINDOW SESSION PATTERN
 *
 * This is a security/UX balance technique:
 *
 * Day 0: User logs in
 *        └── Session created, expires in 30 days
 *
 * Day 14: User is active
 *         └── Past halfway point (15 days)
 *         └── Session EXTENDED to 30 days from now
 *
 * Day 44: User is active again
 *         └── Session extended again to 30 days from now
 *
 * WHY THIS PATTERN?
 * - Active users stay logged in indefinitely (good UX)
 * - Inactive users get logged out after 30 days (good security)
 * - Compromised sessions expire if attacker doesn't keep using them
 */
const SESSION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 15; // 15 days
const SESSION_MAX_DURATION_MS = SESSION_REFRESH_INTERVAL_MS * 2; // 30 days

// =============================================================================
// CREATE SESSION
// =============================================================================
/**
 * Creates a new session in the database.
 *
 * FLOW:
 * 1. Receive plain token (will be stored in browser cookie)
 * 2. Hash it to create session ID (stored in database)
 * 3. Calculate expiration date (30 days from now)
 * 4. Insert session record into database
 *
 * @param sessionToken - Plain text token from generateRandomToken()
 * @param userId - The user this session belongs to
 * @returns The created session object
 *
 * SECURITY NOTE:
 * The sessionToken goes to the browser cookie.
 * The HASHED version (sessionId) goes to the database.
 * Even if database is compromised, attacker can't forge cookies.
 */
export const createSession = async (sessionToken: string, userId: string) => {
  // CRITICAL: Hash the token before storing
  const sessionId = hashToken(sessionToken);

  const session = {
    id: sessionId, // Hashed version stored in DB
    userId,
    expiresAt: new Date(Date.now() + SESSION_MAX_DURATION_MS),
  };

  // Direct Prisma call - no adapter abstraction needed!
  await prisma.session.create({
    data: session,
  });

  return session;
};

// =============================================================================
// VALIDATE SESSION
// =============================================================================
/**
 * Validates a session token and returns the session + user if valid.
 * This is called on EVERY authenticated request.
 *
 * FLOW:
 * 1. Hash the token to find the session in DB
 * 2. If no session found → invalid (return nulls)
 * 3. If session expired → delete it and return nulls
 * 4. If session is past halfway point → extend it (sliding window)
 * 5. Return session and user
 *
 * @param sessionToken - The token from the browser cookie
 * @returns { session, user } or { session: null, user: null }
 */
export const validateSession = async (sessionToken: string) => {
  // Step 1: Hash the cookie token to find the DB record
  const sessionId = hashToken(sessionToken);

  // Step 2: Look up session AND user in one query (efficient JOIN)
  const result = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true, // Prisma JOIN - gets user data in same query
    },
  });

  // Step 3: No session found = invalid token
  if (!result) {
    return { session: null, user: null };
  }

  // Destructure: separate user from session fields
  const { user, ...session } = result;

  // Step 4: Check if session has expired
  if (Date.now() >= session.expiresAt.getTime()) {
    // Clean up expired session from database
    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    });

    return { session: null, user: null };
  }

  // Step 5: SLIDING WINDOW - Extend session if past halfway point
  // If we're within 15 days of expiration, extend to 30 days from now
  if (Date.now() >= session.expiresAt.getTime() - SESSION_REFRESH_INTERVAL_MS) {
    session.expiresAt = new Date(Date.now() + SESSION_MAX_DURATION_MS);

    await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        expiresAt: session.expiresAt,
      },
    });
  }

  // Step 6: Return valid session and user
  return { session, user };
};

// =============================================================================
// INVALIDATE SESSION
// =============================================================================
/**
 * Deletes a session from the database.
 *
 * WHEN TO USE:
 * - Sign out (user-initiated)
 * - Password change (security: invalidate all sessions)
 * - Account deletion
 * - Admin forcing logout
 *
 * NOTE: This takes sessionId (the hashed version), not the token.
 * When signing out, you already have the session object from getAuth().
 */
export const invalidateSession = async (sessionId: string) => {
  await prisma.session.delete({
    where: {
      id: sessionId,
    },
  });
};

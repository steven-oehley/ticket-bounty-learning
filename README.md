# 🎫 TicketBounty

A full-stack, production-ready ticket management application built with **Next.js 16**, **React 19**, **TypeScript**, **Prisma**, and **PostgreSQL**. This project is the result of completing [The Road to Next](https://www.road-to-next.com/) course series by Robin Wieruch.

---

## 📚 Course Overview

This project spans two comprehensive courses totaling **45+ sections** and **400+ lessons**:

| Course    | Focus                                                     | Duration  |
| --------- | --------------------------------------------------------- | --------- |
| **Basic** | Fundamentals, Server Components, Forms, Auth, Pagination  | ~15 hours |
| **Pro**   | Multi-tenancy, Email, Queues, File Uploads, Subscriptions | ~12 hours |

---

## 🛠️ Tech Stack

### Core

- **Next.js 15** - React framework with App Router
- **React 19** - UI library with Server Components
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Relational database

### UI & Styling

- **shadcn/ui** - Accessible component library
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icon library
- **next-themes** - Light/Dark mode

### Authentication & Authorization

- **Lucia Auth** - Session-based authentication
- **Oslo** - Crypto utilities for tokens

### Forms & Validation

- **Zod** - Schema validation
- **React Hook Form** - Form state management
- **nuqs** - Type-safe URL state management

### External Services

- **Resend** - Transactional emails
- **React Email** - Email templates
- **Inngest** - Message queue & background jobs
- **AWS S3** - File storage
- **Stripe** - Subscription payments

### Development

- **ESLint** - Code linting
- **Vercel** - Deployment platform

---

## 🎓 What You'll Learn

### Basic Course

#### 1. React & Next.js Fundamentals

- JSX, Components, Props, State
- File-based routing (pages, layouts, templates)
- Static and dynamic routes
- Absolute imports and path constants

#### 2. Server vs Client Components

- React Server Components (RSC) architecture
- Client-Server boundary and composition
- SSR vs Server Components
- Streaming and Suspense

#### 3. Styling & Theming

- Tailwind CSS configuration
- shadcn/ui component integration
- Light and dark mode implementation
- Component and feature folder architecture

#### 4. Data Layer

- PostgreSQL database setup
- Prisma ORM configuration
- Database schema design
- Migrations and seeding

#### 5. Caching Strategies

- Full Route Cache
- Data Cache
- Time-Based Cache (ISR)
- On-Demand Revalidation
- Request Memoization
- `generateStaticParams`

#### 6. Forms & Server Actions

- Progressive enhancement
- `useTransition`, `useFormStatus`, `useActionState`
- Form validation with Zod
- Error handling and toast feedback
- Action callbacks

#### 7. Authentication

- Lucia Auth setup
- Sign up, sign in, sign out flows
- Password hashing
- Session management

#### 8. Authorization

- Protected routes with middleware
- Ownership-based access control
- Protected APIs and UI elements

#### 9. Advanced Navigation

- Sidebar implementation
- Breadcrumbs
- Tabs with URL state
- Active path detection (Levenshtein distance)
- Account dropdown

#### 10. Search, Sort & Pagination

- `useSearchParams` and `searchParams`
- Debounced search
- Sorting with URL state
- nuqs for type-safe URL state
- Offset-based pagination
- Cursor-based pagination

#### 11. Optimistic Updates

- React 19 `useOptimistic`
- Client-side state management
- Sliding window patterns

#### 12. React Query (Optional)

- `useInfiniteQuery` for pagination
- Query invalidation
- Infinite scroll implementation

---

### Pro Course

#### 1. Password Reset Flow

- Forgot password page
- Secure token generation
- Password reset via email link
- Change password (authenticated)

#### 2. Email System

- React Email for templates
- Resend for delivery
- Custom email domains
- Email preview during development

#### 3. Message Queue

- Inngest setup and configuration
- Event-driven architecture
- Background job processing
- Email queue implementation

#### 4. Email Verification

- Verification token generation
- Email verification flow
- Resend verification email

#### 5. Multi-Tenant Organizations

- Many-to-many relationships
- Organization CRUD
- Onboarding workflow
- Organization switching
- Default organization handling

#### 6. Memberships & Roles

- Membership management
- Role-based access control (RBAC)
- Admin vs member permissions
- Protected admin routes/APIs/UI

#### 7. Invitation System

- Email invitations
- Token-based acceptance
- Anonymous vs authenticated acceptance
- Invitation revocation

#### 8. File Uploads

- AWS S3 configuration
- IAM permissions
- File validation
- Presigned URLs for secure downloads
- Attachment management

#### 9. Architecture Patterns

- Service Layer abstraction
- Data Access Layer (DAL)
- DTOs (Data Transfer Objects)
- Polymorphic relationships
- Self-referential relations

#### 10. Security

- XSS prevention
- Environment variable safety
- `"server only"` directive
- Secure token handling

#### 11. Stripe Subscriptions

- Stripe API integration
- Customer management
- Products and pricing
- Checkout sessions
- Webhook handling
- Subscription status tracking
- Plan changes and cancellations
- Test clocks for development
- Provisioning and deprovisioning

---

## 📁 Project Structure

```text
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── (dashboard)/       # Protected routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   └── [feature]/         # Feature components
├── features/
│   ├── auth/              # Authentication
│   ├── ticket/            # Ticket management
│   ├── comment/           # Comments
│   ├── organization/      # Multi-tenancy
│   ├── membership/        # Memberships
│   ├── invitation/        # Invitations
│   ├── attachment/        # File uploads
│   └── subscription/      # Stripe subscriptions
├── lib/
│   ├── prisma.ts          # Prisma client
│   ├── auth.ts            # Auth utilities
│   └── [service].ts       # Service utilities
├── emails/                # React Email templates
├── inngest/               # Background jobs
└── constants/             # Path constants
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm/pnpm/yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ticket-bounty

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Push database schema
npx prisma db push

# Seed the database
npx prisma db seed

# Start development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
AUTH_SECRET="your-secret-key"

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="..."
AWS_S3_BUCKET="..."

# Payments (Stripe)
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."

# Inngest
INNGEST_EVENT_KEY="..."
INNGEST_SIGNING_KEY="..."
```

---

## 📝 Key Concepts Learned

### Software Craftsmanship Principles

- **Configuration over Composition** - When to use props vs configuration objects
- **DRY with Abstractions** - Balancing reusability with readability
- **Premature Optimization** - Avoiding over-engineering
- **Debugging Strategies** - Systematic problem-solving
- **Idempotence** - Designing safe, repeatable operations
- **Race Conditions** - Handling concurrent operations

### Architecture Decisions

- When to introduce a Service Layer
- When to introduce a Data Access Layer
- When to abstract vs when to keep inline
- Handling polymorphic relationships
- Managing database transactions

---

## 🔗 Related Resources

- [The Road to Next Course](https://www.road-to-next.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Lucia Auth Documentation](https://lucia-auth.com/)
- [Stripe Documentation](https://stripe.com/docs)

---

## 📄 License

This project was built for educational purposes as part of The Road to Next course by Robin Wieruch.

---

## 🙏 Acknowledgments

- **Robin Wieruch** - Course author and instructor
- **Delba de Oliveira** - Foreword contributor (DX Engineer at Vercel)
- The Road to Next community

---

## 🎯 Next Steps (Project Ideas from Course)

After completing the course, consider implementing:

1. **Onboarding Workflow** - Guided user setup
2. **Audit Log** - Track all user actions
3. **Dashboard / Reporting** - Analytics and insights
4. **Multi-Invite Flow** - Bulk invitation system

// =============================================================================
// src/features/auth/queries/get-auth.ts
// PURPOSE: Get current authenticated user and session
// =============================================================================

'use server';

import { cache } from 'react';
import { cookies } from 'next/headers';

import { validateSession } from '../utils/session';
import { SESSION_COOKIE_NAME } from '../utils/session-cookie';

/**
 * Gets the current authenticated session and user.
 *
 * IMPORTANT CHANGES FROM LUCIA V3:
 *
 * 1. NO MORE COOKIE REFRESH HERE
 *    - Lucia tried to refresh cookies in getAuth()
 *    - This failed in RSC (couldn't write cookies)
 *    - Now: validateSession() handles session extension internally
 *    - Cookie expiration is set at sign-in, not refreshed
 *
 * 2. SIMPLER FLOW
 *    - Get token from cookie
 *    - Validate session (includes user data)
 *    - Return result
 *
 * 3. CACHED FOR REQUEST DEDUPLICATION
 *    - React's cache() ensures this only runs once per request
 *    - Even if called 10 times in RSC tree, only 1 DB query
 *
 * WHERE TO USE THIS:
 * - Server Components (to check if user is logged in)
 * - Server Actions (to get user before mutations)
 * - API routes (to authenticate requests)
 */
export const getAuth = cache(async () => {
  // Step 1: Get the session token from cookie
  const sessionToken = (await cookies()).get(SESSION_COOKIE_NAME)?.value ?? null;

  // Step 2: No cookie = not logged in
  if (!sessionToken) {
    return {
      user: null,
      session: null,
    };
  }

  // Step 3: Validate and return
  // validateSession handles:
  // - Token → ID hashing
  // - Expiration check
  // - Session extension (sliding window)
  // - User data fetching (via Prisma include)
  return await validateSession(sessionToken);
});

// =============================================================================
// src/features/auth/utils/session-cookie.ts
// PURPOSE: Browser cookie management for sessions
// =============================================================================

import { cookies } from 'next/headers';

/**
 * Cookie name constant.
 *
 * TIP: Robin uses "session" but you could use something more specific
 * like "auth_session" or "ticket_bounty_session" to avoid conflicts
 * if you ever have multiple cookies.
 */
export const SESSION_COOKIE_NAME = 'auth_session';

/**
 * Sets the session cookie in the user's browser.
 *
 * COOKIE ATTRIBUTES EXPLAINED:
 *
 * httpOnly: true
 *   └── JavaScript CANNOT read this cookie (document.cookie won't see it)
 *   └── Prevents XSS attacks from stealing session tokens
 *   └── The cookie is ONLY sent with HTTP requests
 *
 * sameSite: "lax"
 *   └── Cookie sent with same-site requests
 *   └── Cookie sent with top-level navigations (clicking links)
 *   └── NOT sent with cross-site POST requests (CSRF protection)
 *   └── "lax" allows OAuth redirects to work (user clicks "Login with Google")
 *   └── "strict" would block even OAuth redirects
 *
 * secure: true (in production)
 *   └── Cookie ONLY sent over HTTPS
 *   └── Prevents man-in-the-middle attacks on HTTP
 *   └── Set to false in development (localhost uses HTTP)
 *
 * path: "/"
 *   └── Cookie sent with requests to ANY path on your domain
 *   └── /api/*, /dashboard/*, /tickets/* - all get the cookie
 *
 * expires: expiresAt
 *   └── When the cookie expires (matches session expiration)
 *   └── Browser automatically deletes cookie after this date
 */
export const setSessionCookie = async (
  sessionToken: string, // Plain token (NOT hashed)
  expiresAt: Date
) => {
  const cookie = {
    name: SESSION_COOKIE_NAME,
    value: sessionToken,
    attributes: {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: expiresAt,
    },
  };

  (await cookies()).set(cookie.name, cookie.value, cookie.attributes);
};

/**
 * Deletes the session cookie (sign out).
 *
 * HOW IT WORKS:
 * - Set the cookie value to empty string
 * - Set maxAge to 0 (tells browser to delete immediately)
 *
 * WHY NOT JUST cookies().delete()?
 * - We need to set the same attributes (path, secure, etc.)
 * - Otherwise the browser might not find the right cookie to delete
 */
export const deleteSessionCookie = async () => {
  const cookie = {
    name: SESSION_COOKIE_NAME,
    value: '',
    attributes: {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0, // Delete immediately
    },
  };

  (await cookies()).set(cookie.name, cookie.value, cookie.attributes);
};

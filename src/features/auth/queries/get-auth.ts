import { cache } from 'react';
import { cookies } from 'next/headers';

import { lucia } from '@/lib/lucia';

export const getAuth = cache(async () => {
  const cookieJar = await cookies();

  //   get the session cookie
  const sessionCookie = cookieJar.get(lucia.sessionCookieName);
  const sessionId = sessionCookie?.value ?? null;

  //   if no session id return this null object
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  //   if we have a sessionId validate it with lucia
  const result = await lucia.validateSession(sessionId);

  //   WE CAN READ IN ALL CONTEXTS BUT CAN ONLY WRITE IN SERVER ACTIONS
  try {
    // TRY AND WRITE
    if (result.session && result.session.fresh) {
      // if there is a session and it is not expired
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      const cookieJar = await cookies();
      cookieJar.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }

    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      const cookieJar = await cookies();
      cookieJar.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch {
    // DO NOTHING IF USED IN RSC
  }

  return result;
});

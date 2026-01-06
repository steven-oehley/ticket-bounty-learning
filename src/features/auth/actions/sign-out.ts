'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { signInPath } from '@/constants/paths';
import { lucia } from '@/lib/lucia';

import { getAuth } from '../queries/get-auth';

export const signOut = async () => {
  const { session } = await getAuth();

  if (!session) {
    redirect(signInPath);
  }

  await lucia.invalidateSession(session.id);

  //    delete the session cookie
  const sessionCookie = lucia.createBlankSessionCookie();

  //  lucia.createBlankSessionCookie() returns:
  //   {
  //     name: 'auth_session',
  //     value: '',
  //     attributes: {
  //       maxAge: 0,  // ← THIS is the key
  //       // or expires: new Date(0)
  //     }
  //   }
  //   no "delete cookie" command in HTTP. Instead, you tell the browser to expire it immediately:

  (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  redirect(signInPath);
};

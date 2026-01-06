// =============================================================================
// src/features/auth/actions/sign-out.ts
// =============================================================================

'use server';

import { redirect } from 'next/navigation';

import { signInPath } from '@/constants/paths';

import { getAuth } from '../actions/get-auth';
import { invalidateSession } from '../utils/session';
import { deleteSessionCookie } from '../utils/session-cookie';

export const signOut = async () => {
  const { session } = await getAuth();

  if (!session) {
    redirect(signInPath);
  }

  // Step 1: Delete session from database
  await invalidateSession(session.id);

  // Step 2: Delete cookie from browser
  await deleteSessionCookie();

  redirect(signInPath);
};

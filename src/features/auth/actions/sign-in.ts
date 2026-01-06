'use server';

import { redirect } from 'next/navigation';

import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { ticketsPath } from '@/constants/paths';
import { createSession } from '@/features/auth/utils/session';
import { setSessionCookie } from '@/features/auth/utils/session-cookie';
// NEW: Import from your own utilities
import { verifyPasswordHash } from '@/features/password/utils/hash-and-verify';
import prisma from '@/lib/prisma';
import { generateRandomToken } from '@/utils/crypto';

import { signInSchema } from '../schemas/form-schemas';

export const signIn = async (_actionState: ActionState, formData: FormData) => {
  // Keep email but strip password from any error responses
  const strippedFormData = new FormData();
  strippedFormData.append('email', formData.get('email') as string);

  try {
    const result = signInSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!result.success) {
      return fromErrorToActionState(result.error, strippedFormData);
    }

    const user = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    if (!user) {
      return toActionState('Incorrect email or password', 'ERROR', strippedFormData);
    }

    // OLD: const passwordValid = await verify(user.passwordHash, result.data.password);
    // NEW: Use wrapped function (note: argument order is hash first, then password)
    const passwordValid = await verifyPasswordHash(user.passwordHash, result.data.password);

    if (!passwordValid) {
      return toActionState('Incorrect email or password', 'ERROR', strippedFormData);
    }

    // OLD (Lucia):
    // const session = await lucia.createSession(user.id, {});
    // const sessionCookie = lucia.createSessionCookie(session.id);
    // const cookieJar = await cookies();
    // cookieJar.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    // NEW (Oslo):
    const sessionToken = generateRandomToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionCookie(sessionToken, session.expiresAt);
  } catch (error) {
    return fromErrorToActionState(error, strippedFormData);
  }

  redirect(ticketsPath);
};

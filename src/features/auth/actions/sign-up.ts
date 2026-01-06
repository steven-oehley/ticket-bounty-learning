'use server';

import { redirect } from 'next/navigation';

import { type ActionState, fromErrorToActionState } from '@/components/form/utils/to-action-state';
import { ticketsPath } from '@/constants/paths';
import { createSession } from '@/features/auth/utils/session';
import { setSessionCookie } from '@/features/auth/utils/session-cookie';
// NEW: Import from your own utilities instead of lucia
import { hashPassword } from '@/features/password/utils/hash-and-verify';
import prisma from '@/lib/prisma';
import { generateRandomToken } from '@/utils/crypto';

import { signUpSchema } from '../schemas/form-schemas';

export const signUp = async (_actionState: ActionState, formData: FormData) => {
  const strippedFormData = new FormData();
  ['username', 'email'].forEach((key) => {
    const value = formData.get(key);
    if (value) strippedFormData.append(key, value);
  });

  try {
    const result = signUpSchema.safeParse({
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (!result.success) {
      return fromErrorToActionState(result.error, strippedFormData);
    }

    // OLD: const passwordHash = await hash(result.data.password);
    // NEW: Use wrapped function with secure defaults
    const passwordHash = await hashPassword(result.data.password);

    const dbData = {
      username: result.data.username,
      email: result.data.email,
      passwordHash,
    };

    const user = await prisma.user.create({
      data: dbData,
    });

    // OLD (Lucia):
    // const session = await lucia.createSession(user.id, {});
    // const sessionCookie = lucia.createSessionCookie(session.id);
    // const cookieJar = await cookies();
    // cookieJar.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    // NEW (Oslo):
    const sessionToken = generateRandomToken(); // 1. Generate plain token
    const session = await createSession(sessionToken, user.id); // 2. Store hashed in DB
    await setSessionCookie(sessionToken, session.expiresAt); // 3. Set cookie with plain token
  } catch (error) {
    return fromErrorToActionState(error, strippedFormData);
  }

  redirect(ticketsPath);
};

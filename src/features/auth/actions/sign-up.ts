'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { hash } from '@node-rs/argon2';

import { type ActionState, fromErrorToActionState } from '@/components/form/utils/to-action-state';
import { ticketsPath } from '@/constants/paths';
import { lucia } from '@/lib/lucia';
import prisma from '@/lib/prisma';

import { signUpSchema } from '../schemas/form-schemas';

export const signUp = async (_actionState: ActionState, formData: FormData) => {
  const strippedFormData = new FormData();
  ['username', 'email'].forEach((key) => {
    const value = formData.get(key);
    if (value) strippedFormData.append(key, value);
  });

  try {
    //  try to parse
    const result = signUpSchema.safeParse({
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    // if schema not valid return with the error
    if (!result.success) {
      // dont want to return passwords in the actionState
      return fromErrorToActionState(result.error, strippedFormData);
    }

    const passwordHash = await hash(result.data.password);

    //  if schema valid we select data to upload
    const dbData = {
      username: result.data.username,
      email: result.data.email,
      passwordHash,
    };

    // upload the data adn save to variable for session creation
    const user = await prisma.user.create({
      data: dbData,
    });

    // ONCE USER CREATED WE WOULD REDIRECT AND LOG THEM IN SO WE NEED TO CREATE A SESSION
    const session = await lucia.createSession(user.id, {}); // creat session in db
    const sessionCookie = lucia.createSessionCookie(session.id); // create session cookie

    const cookieJar = await cookies();
    cookieJar.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes); // place the session cookie
  } catch (error) {
    //  if error other than schema error occurs we return it here.
    //  dont return the passwords
    return fromErrorToActionState(error, strippedFormData);
  }

  // redirect after the try catch so no accidental redirect errors caught
  redirect(ticketsPath);
};

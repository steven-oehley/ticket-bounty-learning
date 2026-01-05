'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { verify } from '@node-rs/argon2';

import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { ticketsPath } from '@/constants/paths';
import { lucia } from '@/lib/lucia';
import prisma from '@/lib/prisma';

import { signInSchema } from '../schemas/form-schemas';

export const signIn = async (_actionState: ActionState, formData: FormData) => {
  const strippedFormData = new FormData();
  strippedFormData.append('email', formData.get('email') as string);

  try {
    //  try to parse
    const result = signInSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    // if schema not valid return with the error
    if (!result.success) {
      // dont want to return passwords in the actionState
      return fromErrorToActionState(result.error, strippedFormData);
    }

    //  if schema valid we find the user associated with that email address used
    const user = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    if (!user) {
      return toActionState('Incorrect email or password', 'ERROR');
    }

    // if we find a user for the email verify the password
    const passwordValid = await verify(user.passwordHash, result.data.password);

    if (!passwordValid) {
      return toActionState('Incorrect email or password', 'ERROR');
    }

    // if email and password valid - then we create the session in the db and place cookie
    // ONCE USER SIGNIN WE WOULD REDIRECT AND LOG THEM IN SO WE NEED TO CREATE A SESSION
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

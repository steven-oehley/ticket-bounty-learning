'use server';

import { redirect } from 'next/navigation';

import { hash } from '@node-rs/argon2';

import { type ActionState, fromErrorToActionState } from '@/components/form/utils/to-action-state';
import { ticketsPath } from '@/constants/paths';

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

    const passwordHash = await hash(result.data.password);

    //  if schema valid we select data to upload
    const dbData = {
      email: result.data.email,
      passwordHash,
    };

    console.info(dbData);
    // TODO: IMPLEMENT SIGNIN LOGIC
  } catch (error) {
    //  if error other than schema error occurs we return it here.
    //  dont return the passwords
    return fromErrorToActionState(error, strippedFormData);
  }

  // redirect after the try catch so no accidental redirect errors caught
  redirect(ticketsPath);
};

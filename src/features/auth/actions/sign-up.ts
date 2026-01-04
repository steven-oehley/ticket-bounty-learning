'use server';

import { redirect } from 'next/navigation';

import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { ticketsPath } from '@/constants/paths';

import { signUpSchema } from '../schemas/form-schemas';

export const signUp = async (actionState: ActionState, formData: FormData) => {
  console.info(formData);
  // TRY
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

    // TODO: ADD LOGIC FOR SIGNUP

    // if schema not valid return with the error
    if (!result.success) {
      // dont want to return passwords in the actionState
      return fromErrorToActionState(result.error, strippedFormData);
    }

    //  if schema valid we select data to upload
    // const dbData = {};

    // upload the data
    // await prisma.user.upsert({});
  } catch (error) {
    //  if error other than schema error occurs we return it here.
    //  dont return the passwords
    return fromErrorToActionState(error, strippedFormData);
  }

  // revalidate and redirect after the try catch so no accidental redirect errors caught! :)
  redirect(ticketsPath);

  return toActionState('Sign Up successful!');
};

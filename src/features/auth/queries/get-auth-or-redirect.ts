import { redirect } from 'next/navigation';

import { setCookieByKey } from '@/actions/cookies';
import { signInPath } from '@/constants/paths';

import { getAuth } from '../actions/get-auth';

export const getAuthOrRedirect = async () => {
  const auth = await getAuth();

  if (!auth.user) {
    await setCookieByKey('toastErrorMessage', 'First sign in to perform authorised action');
    redirect(signInPath);
  }

  return auth;
};

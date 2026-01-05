'use client';

import { useActionState } from 'react';

import FieldError from '@/components/form/field-error';
import Form from '@/components/form/form';
import SubmitBtn from '@/components/form/submit-btn';
import { EMPTY_ACTION_STATE } from '@/components/form/utils/to-action-state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signIn } from '../../actions/sign-in';

const SignUpForm = () => {
  const [signInActionState, signInAction, isPending] = useActionState(signIn, EMPTY_ACTION_STATE);
  return (
    <Form action={signInAction} actionState={signInActionState}>
      <Label htmlFor="email">Email:</Label>
      <Input
        defaultValue={(signInActionState.payload?.get('email') as string) || ''}
        id="email"
        name="email"
        placeholder="Enter your email"
        type="email"
      />
      <FieldError actionState={signInActionState} name="email" />
      <Label htmlFor="password">Password:</Label>
      <Input id="password" name="password" placeholder="Enter a strong password" type="password" />
      <FieldError actionState={signInActionState} name="password" />

      <SubmitBtn isDisabled={isPending} label="Sign In" />
    </Form>
  );
};
export default SignUpForm;

'use client';

import { useActionState } from 'react';

import FieldError from '@/components/form/field-error';
import Form from '@/components/form/form';
import SubmitBtn from '@/components/form/submit-btn';
import { EMPTY_ACTION_STATE } from '@/components/form/utils/to-action-state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signUp } from '../../actions/sign-up';

const SignUpForm = () => {
  const [signUpActionState, signUpAction, isPending] = useActionState(signUp, EMPTY_ACTION_STATE);
  return (
    <Form action={signUpAction} actionState={signUpActionState}>
      <Label htmlFor="username">Username:</Label>
      <Input
        defaultValue={signUpActionState.payload?.get('username') as string}
        id="username"
        name="username"
        placeholder="Enter your username"
      />
      <FieldError actionState={signUpActionState} name="username" />
      <Label htmlFor="email">Email:</Label>
      <Input
        defaultValue={signUpActionState.payload?.get('email') as string}
        id="email"
        name="email"
        placeholder="Enter your email"
        type="email"
      />
      <FieldError actionState={signUpActionState} name="email" />
      <Label htmlFor="password">Password:</Label>
      <Input id="password" name="password" placeholder="Enter a strong password" type="password" />
      <FieldError actionState={signUpActionState} name="password" />
      <Label htmlFor="confirmPassword">Confirm Password:</Label>
      <Input
        id="confirmPassword"
        name="confirmPassword"
        placeholder="Confirm your password"
        type="password"
      />
      <FieldError actionState={signUpActionState} name="confirmPassword" />
      <SubmitBtn isDisabled={isPending} label="Sign Up" />
    </Form>
  );
};
export default SignUpForm;

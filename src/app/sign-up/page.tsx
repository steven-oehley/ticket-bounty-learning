import Link from 'next/link';

import CardCompact from '@/components/card-compact';
import { signInPath } from '@/constants/paths';
import SignUpForm from '@/features/auth/components/form/sign-up-form';

const SignUpPage = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <CardCompact
        description="Create an account"
        footer={
          <div className="text-muted-foreground text-sm">
            <span>Have an account?</span>{' '}
            <Link className="font-semibold underline" href={signInPath}>
              Sign in now.
            </Link>
          </div>
        }
        title="Sign Up To Ticket Bounty"
      >
        <SignUpForm />
      </CardCompact>
    </div>
  );
};
export default SignUpPage;

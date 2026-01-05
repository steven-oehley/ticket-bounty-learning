import Link from 'next/link';

import CardCompact from '@/components/card-compact';
import { signUpPath } from '@/constants/paths';
import SigInForm from '@/features/auth/components/form/sign-in-form';

const SignInPage = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <CardCompact
        description="Sign in to your account below"
        footer={
          <div className="text-muted-foreground text-sm">
            <span>No account?</span>{' '}
            <Link className="font-semibold underline" href={signUpPath}>
              Sign up now
            </Link>
          </div>
        }
        title="Sign In To Ticket Bounty"
      >
        <SigInForm />
      </CardCompact>
    </div>
  );
};
export default SignInPage;

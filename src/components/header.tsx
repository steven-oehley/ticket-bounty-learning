import Link from 'next/link';

import { LucideLogOut, LucideTicketCheck } from 'lucide-react';

import { homePath, signInPath, signUpPath, ticketsPath } from '@/constants/paths';
import { signOut } from '@/features/auth/actions/sign-out';
import { getAuth } from '@/features/auth/queries/get-auth';

import SubmitBtn from './form/submit-btn';
import { ThemeToggle } from './theme/theme-toggle';
import { Button } from './ui/button';

const Header = async () => {
  // This busts any static rendering because of cookies api
  // Handle dynamic content then we no longer statically render
  // cookies() is a dynamic function - Next.js can't know the cookie value at build time, so it forces dynamic rendering
  // if you wanted some pages static (marketing, docs), you could: Move the header auth check to a client component
  // client components don't run at build time or on the server request - they run in the browser
  const { user, session } = await getAuth();

  const isLoggedIn = !!user;
  console.info(isLoggedIn, user, session);

  return (
    <nav className="supports-backdrop-blur:bg-background/60 bg-background/95 fixed top-0 right-0 left-0 z-20 flex w-full justify-between border-b px-12 py-2.5 backdrop-blur">
      <div>
        <Button asChild variant="ghost">
          <Link href={homePath}>
            <LucideTicketCheck />
            <h1 className="text-lg font-semibold">TicketBounty</h1>
          </Link>
        </Button>
      </div>
      <div className="align-items flex gap-x-2">
        <ThemeToggle />
        {/* NAV ITEMS */}

        {!isLoggedIn && (
          <>
            <Button asChild className="cursor-pointer" variant="secondary">
              <Link href={signUpPath}>Sign Up</Link>
            </Button>
            <Button asChild className="cursor-pointer" variant="default">
              <Link href={signInPath}>Sign In</Link>
            </Button>
          </>
        )}
        {isLoggedIn && (
          <>
            <Button asChild className="cursor-pointer" variant="default">
              <Link href={ticketsPath}>Tickets</Link>
            </Button>
            <form action={signOut}>
              <SubmitBtn icon={<LucideLogOut />} label="Sign Out" variant="ghost" />
            </form>
          </>
        )}
      </div>
    </nav>
  );
};

export { Header };

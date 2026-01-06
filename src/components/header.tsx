'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { type User as AuthUser } from 'lucia';
import { LucideLogOut, LucideTicketCheck } from 'lucide-react';

import { homePath, signInPath, signUpPath, ticketsPath } from '@/constants/paths';
import { getAuth } from '@/features/auth/actions/get-auth';
import { signOut } from '@/features/auth/actions/sign-out';

import SubmitBtn from './form/submit-btn';
import { ThemeToggle } from './theme/theme-toggle';
import { Button } from './ui/button';

const Header = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { user } = await getAuth();
      setUser(user);
    };

    getUser();
  }, [pathname]); // re-fetch when route changes

  const isLoggedIn = !!user;

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

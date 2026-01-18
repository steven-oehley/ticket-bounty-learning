'use client';

import Link from 'next/link';

import { LucideLogOut, LucideTicketCheck } from 'lucide-react';

import { homePath, signInPath, signUpPath } from '@/constants/paths';
import { signOut } from '@/features/auth/actions/sign-out';
import { useAuth } from '@/features/auth/hooks/use-auth';

import SubmitBtn from './form/submit-btn';
import { ThemeToggle } from './theme/theme-toggle';
import { Button } from './ui/button';

const Header = () => {
  const { user, isLoading } = useAuth();
  console.info(user, isLoading);
  const isLoggedIn = !!user;

  const navItems = isLoading ? null : (
    <div className="align-items animate-in slide-in-from-top flex gap-x-2 duration-600">
      <ThemeToggle />
      {isLoggedIn ? (
        <form action={signOut}>
          <SubmitBtn icon={<LucideLogOut />} label="Sign Out" variant="ghost" />
        </form>
      ) : (
        <>
          <Button asChild className="cursor-pointer" variant="secondary">
            <Link href={signUpPath}>Sign Up</Link>
          </Button>
          <Button asChild className="cursor-pointer" variant="default">
            <Link href={signInPath}>Sign In</Link>
          </Button>
        </>
      )}
    </div>
  );

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
      {/* NAV ITEMS */}
      {navItems}
    </nav>
  );
};

export { Header };

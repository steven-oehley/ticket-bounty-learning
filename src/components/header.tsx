import Link from 'next/link';

import { LucideTicketCheck } from 'lucide-react';

import { homePath, ticketsPath } from '@/constants/paths';

import { ThemeToggle } from './theme/theme-toggle';
import { Button } from './ui/button';

const Header = () => {
  return (
    <nav className="supports-backdrop-blur:bg-background/60 bg-background/95 fixed top-0 right-0 left-0 z-20 flex w-full justify-between border-b px-5 py-2.5 backdrop-blur">
      <div>
        <Button asChild variant="ghost">
          <Link href={homePath}>
            <LucideTicketCheck />
            <h1 className="text-lg font-semibold">TicketBounty</h1>
          </Link>
        </Button>
      </div>
      <div className="flex gap-4">
        <ThemeToggle />
        <Button asChild className="cursor-pointer" variant="default">
          <Link href={ticketsPath}>Tickets</Link>
        </Button>
      </div>
    </nav>
  );
};

export { Header };

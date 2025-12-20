import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { homePath, ticketsPath } from '@/constants/paths';
import { Button } from '@/components/ui/button';
import { LucideTicketCheck } from 'lucide-react';

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Ticket Bounty Learning',
  description: 'A learning project for Ticket Bounty using Next.js 16 and Tailwind CSS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${figtree.variable} antialiased`} lang="en">
      <body>
        <nav className="supports-backdrop-blur:bg-background/60 bg-background/95 fixed top-0 right-0 left-0 z-20 flex w-full justify-between border-b px-5 py-2.5 backdrop-blur">
          <div>
            <Button asChild variant="ghost">
              <Link href={homePath}>
                <LucideTicketCheck />
                <h1 className="text-lg font-semibold">TicketBounty</h1>
              </Link>
            </Button>
          </div>
          <div>
            <Button asChild variant="outline">
              <Link className="text-sm" href={ticketsPath}>
                Tickets
              </Link>
            </Button>
          </div>
        </nav>
        <main className="bg-secondary/20 flex min-h-screen flex-1 flex-col overflow-x-hidden overflow-y-auto px-8 py-24">
          {children}
        </main>
      </body>
    </html>
  );
}

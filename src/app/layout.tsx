import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { homePath, ticketsPath } from '@/constants/paths';

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
            <Link className="text-lg font-bold" href={homePath}>
              Home
            </Link>
          </div>
          <div>
            <Link className="text-sm underline" href={ticketsPath}>
              Tickets
            </Link>
          </div>
        </nav>
        <main className="bg-secondary/20 flex min-h-screen flex-1 flex-col overflow-x-hidden overflow-y-auto px-8 py-24">
          {children}
        </main>
      </body>
    </html>
  );
}

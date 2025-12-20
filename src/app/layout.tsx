import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';

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
        <Header />
        <main className="bg-secondary/20 flex min-h-screen flex-1 flex-col overflow-x-hidden overflow-y-auto px-8 py-24">
          {children}
        </main>
      </body>
    </html>
  );
}

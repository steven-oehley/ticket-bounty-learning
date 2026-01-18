import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';

import { Analytics } from '@vercel/analytics/next';

import { AuthSidebar } from '@/components/auth-sidebar/auth-sidebar';
import { Header } from '@/components/header';
import RedirectToast from '@/components/redirect-toast';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

import './globals.css';

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
    <html suppressHydrationWarning className={`${figtree.variable} antialiased`} lang="en">
      <body>
        <ThemeProvider
          disableTransitionOnChange
          enableSystem
          attribute="class"
          defaultTheme="system"
        >
          <SidebarProvider defaultOpen={false}>
            <AuthSidebar />
            <SidebarInset>
              <Header />
              <section className="bg-secondary/20 flex min-h-screen flex-1 flex-col overflow-x-hidden px-8 py-24">
                {children}
              </section>
            </SidebarInset>
            <Toaster position="bottom-right" />
            <RedirectToast />
            <Analytics />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

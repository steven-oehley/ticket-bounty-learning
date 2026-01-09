import { redirect } from 'next/navigation';

import { signInPath } from '@/constants/paths';
import { getAuth } from '@/features/auth/actions/get-auth';

export default async function TicketAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getAuth();

  if (!user) {
    redirect(signInPath);
  }
  return <>{children}</>;
}

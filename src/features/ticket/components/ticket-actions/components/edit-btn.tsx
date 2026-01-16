import Link from 'next/link';

import { LucidePencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ticketEditPath } from '@/constants/paths';
import { getAuth } from '@/features/auth/actions/get-auth';
import { isTicketOwner } from '@/features/auth/utils/is-ticket-owner';
import { type Ticket } from '@/generated/prisma/client';

interface EditBtnProps {
  ticket: Ticket;
}
const EditBtn = async ({ ticket }: EditBtnProps) => {
  const { user: authUser } = await getAuth();
  const isOwner = isTicketOwner(authUser, ticket);

  if (!isOwner) return null;

  return (
    <Button asChild size="icon" variant="outline">
      {/* prefetch happens when link enters viewport */}
      <Link prefetch href={ticketEditPath(ticket?.id)}>
        <LucidePencil />
      </Link>
    </Button>
  );
};
export default EditBtn;

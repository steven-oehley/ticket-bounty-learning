import { notFound } from 'next/navigation';

import CardCompact from '@/components/card-compact';
import { getAuth } from '@/features/auth/actions/get-auth';
import { isTicketOwner } from '@/features/auth/utils/is-ticket-owner';
import TicketUpsertForm from '@/features/ticket/components/forms/ticket-upsert-form';
import { getTicket } from '@/features/ticket/queries/get-ticket';

interface TicketEditPageProps {
  params: Promise<{
    ticketId: string;
  }>;
}

const TicketEditPage = async ({ params }: TicketEditPageProps) => {
  const { ticketId } = await params;
  const foundTicket = await getTicket(ticketId);
  const { user: authUser } = await getAuth();
  const isOwner = isTicketOwner(authUser, foundTicket);

  if (!foundTicket) {
    notFound();
  }

  if (!isOwner) throw new Error('You do not have permission to edit this ticket');

  return (
    <div className="flex flex-1 items-center justify-center">
      <CardCompact
        className="animate-in fade-in max-w-145 duration-600"
        description="Update your ticket details below."
        title="Edit your ticket"
      >
        <TicketUpsertForm ticket={foundTicket} />
      </CardCompact>
    </div>
  );
};
export default TicketEditPage;

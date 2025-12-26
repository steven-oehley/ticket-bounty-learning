import { notFound } from 'next/navigation';

import CardCompact from '@/components/card-compact';
import TicketEditForm from '@/features/ticket/components/forms/ticket-edit-form';
import { getTicket } from '@/features/ticket/queries/get-ticket';

interface TicketEditPageProps {
  params: Promise<{
    ticketId: string;
  }>;
}

const TicketEditPage = async ({ params }: TicketEditPageProps) => {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);

  if (!ticket) {
    notFound();
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <CardCompact
        className="animate-in fade-in max-w-145 duration-400"
        description="Update your ticket details below."
        title="Edit your ticket"
      >
        <TicketEditForm ticket={ticket} />
      </CardCompact>
    </div>
  );
};
export default TicketEditPage;

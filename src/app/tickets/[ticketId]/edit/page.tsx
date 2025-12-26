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
    <div className="flex justify-center">
      <CardCompact description="Update your ticket details below." title="Edit your ticket">
        <TicketEditForm ticket={ticket} />
      </CardCompact>
    </div>
  );
};
export default TicketEditPage;

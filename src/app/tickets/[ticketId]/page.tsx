import { notFound } from 'next/navigation';

import { TicketItem } from '@/features/ticket/components/ticket-item';
import { getTicket } from '@/features/ticket/queries/get-ticket';

interface TicketPageProps {
  params: Promise<{
    ticketId: string;
  }>;
}

const TicketPage = async ({ params }: TicketPageProps) => {
  const { ticketId } = await params;
  const foundTicket = await getTicket(ticketId);

  if (!foundTicket) {
    notFound();
  }

  return (
    <div className="animate-in fade-in slide-in-from-top flex justify-center duration-400">
      <TicketItem isDetailView ticket={foundTicket} />
    </div>
  );
};

export default TicketPage;

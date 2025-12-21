import Link from 'next/link';

import { Placeholder } from '@/components/placeholder';
import { Button } from '@/components/ui/button';
import { ticketsPath } from '@/constants/paths';
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
    return (
      <Placeholder
        button={
          <Button asChild variant="outline">
            <Link href={ticketsPath}>Go to Tickets</Link>
          </Button>
        }
        label="Ticket not found"
      />
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-top flex justify-center duration-400">
      <TicketItem isDetailView ticket={foundTicket} />
    </div>
  );
};

export default TicketPage;

import { Heading } from '@/components/heading';
import { TicketItem } from '@/features/ticket/components/ticket-item';
import { getTickets } from '@/features/ticket/queries/get-tickets';

const TicketsPage = async () => {
  const tickets = await getTickets();
  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading description="All your tickets at one place" title="Tickets" />
      <div className="animate-in fade-in slide-in-from-top flex flex-1 flex-col items-center gap-y-4 duration-400">
        {tickets.map((ticket) => (
          <TicketItem key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
};

export default TicketsPage;

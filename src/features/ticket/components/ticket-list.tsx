import { getTickets } from '../queries/get-tickets';

import { TicketItem } from './ticket-item';

interface TicketListProps {
  userId?: string;
}

const TicketList = async ({ userId }: TicketListProps) => {
  const tickets = await getTickets(userId);
  return (
    <div className="animate-in fade-in slide-in-from-bottom flex flex-1 flex-col items-center gap-y-4 duration-600">
      {tickets.map((ticket) => (
        <TicketItem key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};
export default TicketList;

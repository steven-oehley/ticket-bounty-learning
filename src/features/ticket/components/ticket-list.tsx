import { getTickets } from '../queries/get-tickets';

import { TicketItem } from './ticket-item';

const TicketList = async () => {
  const tickets = await getTickets();
  return (
    <div className="animate-in fade-in slide-in-from-bottom flex flex-1 flex-col items-center gap-y-4 duration-400">
      {tickets.map((ticket) => (
        <TicketItem key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};
export default TicketList;

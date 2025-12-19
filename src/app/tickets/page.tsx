import Link from 'next/link';
import { initialTickets } from '@/data/data';
import { ticketDetailsPath } from '@/constants/paths';

const TicketsPage = () => {
  return (
    <div>
      {initialTickets.map((ticket) => (
        <div key={ticket.id}>
          <h2 className="text-lg">{ticket.title}</h2>

          <Link className="text-sm underline" href={ticketDetailsPath(ticket.id)}>
            View
          </Link>
        </div>
      ))}
    </div>
  );
};

export default TicketsPage;

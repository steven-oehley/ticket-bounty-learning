import Link from 'next/link';
import { initialTickets } from '@/data/data';
import { ticketDetailsPath } from '@/constants/paths';

const TICKET_ICONS = {
  OPEN: 'O',
  IN_PROGRESS: '>',
  DONE: 'X',
};

const TicketsPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tickets</h2>
        <p className="text-muted-foreground text-sm">All your tickets at one place</p>
      </div>

      <div className="animate-in fade-in slide-in-from-top flex flex-1 flex-col items-center gap-y-4 duration-500">
        {initialTickets.map((ticket) => (
          <div key={ticket.id} className="w-full max-w-105 rounded border border-slate-100 p-4">
            <div>{TICKET_ICONS[ticket.status]}</div>
            <h3 className="truncate text-lg font-semibold">{ticket.title}</h3>
            <p className="truncate text-sm text-slate-500">{ticket.content}</p>
            <Link className="text-sm underline" href={ticketDetailsPath(ticket.id)}>
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketsPage;

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
          <Card key={ticket.id} className="w-full max-w-105">
            <CardHeader>
              <CardTitle className="flex gap-x-2">
                <span>{TICKET_ICONS[ticket.status]}</span>
                <span className="truncate">{ticket.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="line-clamp-2 whitespace-break-spaces">{ticket.content}</span>
            </CardContent>
            <CardFooter>
              <Link className="text-sm underline" href={ticketDetailsPath(ticket.id)}>
                View
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TicketsPage;

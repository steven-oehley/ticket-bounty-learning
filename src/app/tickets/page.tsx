import Link from 'next/link';

import { LucideCheckCircle, LucideFileText, LucidePencil } from 'lucide-react';

import { Heading } from '@/components/heading';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ticketDetailsPath } from '@/constants/paths';
import { initialTickets } from '@/data/data';

const TICKET_ICONS = {
  OPEN: <LucideFileText />,
  DONE: <LucideCheckCircle />,
  IN_PROGRESS: <LucidePencil />,
};

const TicketsPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading description="All your tickets at one place" title="Tickets" />
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

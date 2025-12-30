import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type Ticket } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/currency';

import { TICKET_ICONS } from '../constants';

import TicketActions from './ticket-actions/ticket-actions';

type TicketItemProps = {
  ticket: Ticket;
  isDetailView?: boolean;
};

const TicketItem = ({ ticket, isDetailView }: TicketItemProps) => {
  return (
    <div
      className={cn('flex w-full gap-x-1', {
        'max-w-145': isDetailView,
        'max-w-105': !isDetailView,
      })}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex gap-x-2">
            <span>{TICKET_ICONS[ticket.status]}</span>
            <span className="truncate">{ticket.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span
            className={cn('whitespace-break-spaces', {
              'line-clamp-3': !isDetailView,
            })}
          >
            {ticket.content}
          </span>
        </CardContent>
        <CardFooter className="text-muted-foreground flex justify-between text-sm">
          <p>{ticket.deadline}</p>
          <p>{formatCurrency(ticket.bounty)}</p>
        </CardFooter>
      </Card>
      <TicketActions isDetailedView={isDetailView} ticket={ticket} />
    </div>
  );
};

export { TicketItem };

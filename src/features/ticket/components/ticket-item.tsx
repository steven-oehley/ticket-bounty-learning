import Link from 'next/link';

import { LucideArrowUpRightFromSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ticketDetailsPath } from '@/constants/paths';
import { type Ticket } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';

import { TICKET_ICONS } from '../constants';

type TicketItemProps = {
  ticket: Ticket;
  isDetailView?: boolean;
};

const TicketItem = ({ ticket, isDetailView }: TicketItemProps) => {
  const detailButton = (
    <Button asChild size="icon" variant="outline">
      <Link href={ticketDetailsPath(ticket.id)}>
        <LucideArrowUpRightFromSquare className="h-4 w-4" />
      </Link>
    </Button>
  );

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
      </Card>

      {isDetailView ? null : <div className="flex flex-col gap-y-1">{detailButton}</div>}
    </div>
  );
};

export { TicketItem };

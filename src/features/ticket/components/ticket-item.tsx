import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getAuth } from '@/features/auth/actions/get-auth';
import { isTicketOwner } from '@/features/auth/utils/is-ticket-owner';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/currency';

import { TICKET_ICONS } from '../constants';
import { type TicketWithUser } from '../types';

import TicketActions from './ticket-actions/ticket-actions';

type TicketItemProps = {
  ticket: TicketWithUser;
  isDetailView?: boolean;
};

const TicketItem = async ({ ticket, isDetailView }: TicketItemProps) => {
  const { user: authUser } = await getAuth();
  const isOwner = isTicketOwner(authUser, ticket);

  return (
    <div
      className={cn('flex w-full gap-x-1', {
        'max-w-145': isDetailView,
        'max-w-105': !isDetailView,
      })}
    >
      <Card
        className={cn('w-full', {
          'before:from-primary before:to-primary/50 relative before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-l-2xl before:bg-linear-to-b':
            isOwner,
        })}
      >
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
          <p>
            Created on {ticket.deadline} by{' '}
            {isOwner ? (
              <span className="bg-primary/15 text-primary rounded px-1.5 py-0.5 font-semibold">
                You
              </span>
            ) : (
              ticket.user.username
            )}
          </p>
          <p>{formatCurrency(ticket.bounty)}</p>
        </CardFooter>
      </Card>
      <TicketActions isDetailedView={isDetailView} ticket={ticket} />
    </div>
  );
};

export { TicketItem };

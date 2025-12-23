import Link from 'next/link';

import { LucideArrowUpRightFromSquare, LucideTrash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ticketDetailsPath } from '@/constants/paths';
import { type Ticket } from '@/generated/prisma/client';

import { deleteTicketAction } from '../actions/delete-ticket';

interface TicketActionsProps {
  isDetailedView?: boolean;
  ticket: Ticket;
}

const TicketActions = ({ isDetailedView, ticket }: TicketActionsProps) => {
  const detailButton = (
    <Button asChild size="icon" variant="outline">
      <Link href={ticketDetailsPath(ticket.id)}>
        <LucideArrowUpRightFromSquare />
      </Link>
    </Button>
  );

  const deleteButton = (
    <form action={deleteTicketAction.bind(null, ticket.id)}>
      <Button className="cursor-pointer" size="icon" variant="outline">
        <LucideTrash2 />
      </Button>
    </form>
  );

  return (
    <div className="flex flex-col gap-y-1">
      {!isDetailedView && detailButton}
      {isDetailedView && deleteButton}
    </div>
  );
};
export default TicketActions;

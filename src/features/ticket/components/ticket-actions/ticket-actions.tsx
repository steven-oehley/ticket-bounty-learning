import { LucideTrash2 } from 'lucide-react';

import ConfirmDialog from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { type Ticket } from '@/generated/prisma/client';

import { deleteTicketAction } from '../../actions/delete-ticket';

import DetailBtn from './components/detail-btn';
import EditBtn from './components/edit-btn';
import TicketExtendedOptions from './components/ticket-extended-options';

interface TicketActionsProps {
  isDetailedView?: boolean;
  ticket: Ticket;
}

const TicketActions = ({ isDetailedView, ticket }: TicketActionsProps) => {
  return (
    <div className="flex flex-col gap-y-1">
      {isDetailedView ? (
        <>
          <EditBtn ticketId={ticket.id} />
          {/* <form action={deleteTicketAction.bind(null, ticket.id)}>
            <DeleteBtn />
          </form> */}
          <ConfirmDialog
            action={deleteTicketAction.bind(null, ticket.id)}
            description="This action can not be undone. Once the ticket is deleted, it is lost forever."
            title="Are you sure you want to delete this ticket?"
            trigger={
              <Button className="cursor-pointer" size="icon" variant="outline">
                <LucideTrash2 />
              </Button>
            }
          />
          <TicketExtendedOptions ticket={ticket} />
        </>
      ) : (
        <>
          <DetailBtn ticketId={ticket.id} />
          <EditBtn ticketId={ticket.id} />
        </>
      )}
    </div>
  );
};
export default TicketActions;

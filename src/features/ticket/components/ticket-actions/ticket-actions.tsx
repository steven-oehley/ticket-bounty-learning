import { type Ticket } from '@/generated/prisma/client';

import { deleteTicketAction } from '../../actions/delete-ticket';

import DeleteBtn from './components/delete-btn';
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
          <form action={deleteTicketAction.bind(null, ticket.id)}>
            <DeleteBtn />
          </form>
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

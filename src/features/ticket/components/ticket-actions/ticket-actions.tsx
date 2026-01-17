import { type Ticket } from '@/generated/prisma/client';

import DeleteBtn from './components/delete-btn';
import DetailBtn from './components/detail-btn';
import EditBtn from './components/edit-btn';
import TicketExtendedOptions from './components/ticket-extended-options';

interface TicketActionsProps {
  isDetailedView?: boolean;
  ticket: Ticket;
}

const TicketActions = async ({ isDetailedView, ticket }: TicketActionsProps) => {
  return (
    <div className="flex flex-col gap-y-1">
      {isDetailedView ? (
        <>
          <EditBtn ticket={ticket} />
          <DeleteBtn ticket={ticket} />
          <TicketExtendedOptions ticket={ticket} />
        </>
      ) : (
        <>
          <DetailBtn ticketId={ticket.id} />
          <EditBtn ticket={ticket} />
        </>
      )}
    </div>
  );
};
export default TicketActions;

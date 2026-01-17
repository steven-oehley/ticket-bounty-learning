import TooltipCustom from '@/components/tooltip-custom';
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
          <TooltipCustom message="Edit Ticket">
            <EditBtn ticket={ticket} />
          </TooltipCustom>
          <TooltipCustom message="Delete Ticket">
            <DeleteBtn ticket={ticket} />
          </TooltipCustom>
          <TooltipCustom message="More Actions">
            <TicketExtendedOptions ticket={ticket} />
          </TooltipCustom>
        </>
      ) : (
        <>
          <TooltipCustom message="View details">
            <DetailBtn ticketId={ticket.id} />
          </TooltipCustom>
          <TooltipCustom message="Edit Ticket">
            <EditBtn ticket={ticket} />
          </TooltipCustom>
        </>
      )}
    </div>
  );
};
export default TicketActions;

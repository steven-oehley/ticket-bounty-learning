'use server';

import { revalidatePath } from 'next/cache';

import { fromErrorToActionState, toActionState } from '@/components/form/utils/to-action-state';
import { ticketsPath } from '@/constants/paths';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { type TicketStatus } from '@/generated/prisma/enums';
import prisma from '@/lib/prisma';

import { checkTicketOwnership } from '../queries/check-ticket-ownership';

export const updateTicketStatus = async (ticketId: string, newStatus: TicketStatus) => {
  const { user: authUser } = await getAuthOrRedirect();
  try {
    // check if user has permission - ie is ticketOwner
    const { isAuthorised, message } = await checkTicketOwnership(ticketId, authUser);

    // if do not have permission ie is not owner or could not find ticket for some reason
    if (!isAuthorised) return toActionState(message, 'ERROR');

    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: newStatus },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }
  revalidatePath(ticketsPath);

  return toActionState(
    `Ticket Status Changed To ${newStatus === 'IN_PROGRESS' ? 'In Progress' : newStatus.substring(0, 1).toUpperCase() + newStatus.substring(1).toLowerCase()}`
  );
};

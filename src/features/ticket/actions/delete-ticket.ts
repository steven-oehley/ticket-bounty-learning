'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { setCookieByKey } from '@/actions/cookies';
import { fromErrorToActionState, toActionState } from '@/components/form/utils/to-action-state';
import { ticketsPath } from '@/constants/paths';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { prisma } from '@/lib/prisma';

import { getTicketAndCheckOwner } from '../queries/get-ticket-check-owner';

export const deleteTicketAction = async (ticketId: string) => {
  // get user or redirect
  const { user: authUser } = await getAuthOrRedirect();

  // pause for the deletion UI changes
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    // check if user has permission - ie is ticketOwner
    const { isAllowed, message } = await getTicketAndCheckOwner(ticketId, authUser);

    // if do not have permission ie is not owner or could not find ticket for some reason
    if (!isAllowed) return toActionState(message, 'ERROR');

    await prisma.ticket.delete({
      where: { id: ticketId },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketsPath);
  await setCookieByKey('toastMessage', 'Ticket deleted successfully');
  redirect(ticketsPath);
};

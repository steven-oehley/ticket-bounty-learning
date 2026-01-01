'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { setCookieByKey } from '@/actions/cookies';
import { fromErrorToActionState } from '@/components/form/utils/to-action-state';
import { ticketsPath } from '@/constants/paths';
import { prisma } from '@/lib/prisma';

export const deleteTicketAction = async (ticketId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
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

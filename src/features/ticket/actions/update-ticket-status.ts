'use server';

import { revalidatePath } from 'next/cache';

import { fromErrorToActionState, toActionState } from '@/components/form/utils/to-action-state';
import { ticketsPath } from '@/constants/paths';
import { type TicketStatus } from '@/generated/prisma/enums';
import prisma from '@/lib/prisma';

export const updateTicketStatus = async (ticketId: string, newStatus: TicketStatus) => {
  try {
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

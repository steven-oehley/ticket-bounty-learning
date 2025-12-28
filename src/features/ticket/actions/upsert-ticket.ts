'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { type ActionState, fromErrorToActionState } from '@/components/form/utils/to-action-state';
import { ticketDetailsPath, ticketsPath } from '@/constants/paths';
import prisma from '@/lib/prisma';
import { ticketUpsertSchema } from '@/schemas/form-schemas';

export const upsertTicket = async (
  ticketId: string | undefined,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const result = ticketUpsertSchema.safeParse({
      title: formData.get('title'),
      content: formData.get('content'),
    });

    if (!result.success) {
      return fromErrorToActionState(result.error, formData);
    }

    await prisma.ticket.upsert({
      where: { id: ticketId || '' },
      update: result.data,
      create: result.data,
    });

    revalidatePath(ticketsPath);
    if (ticketId) {
      redirect(ticketDetailsPath(ticketId));
    }

    return { message: 'Ticket created successfully' };
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
};

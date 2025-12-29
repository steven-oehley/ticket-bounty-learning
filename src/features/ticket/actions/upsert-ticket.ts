'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { setCookieByKey } from '@/actions/cookies';
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
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
      bounty: formData.get('bounty'),
      deadline: formData.get('deadline'),
    });

    if (!result.success) {
      return fromErrorToActionState(result.error, formData);
    }

    await prisma.ticket.upsert({
      where: { id: ticketId || '' },
      update: result.data,
      create: result.data,
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  // need to revalidate the tickets path to show the new/updated ticket
  revalidatePath(ticketsPath);

  if (ticketId) {
    // if updating an existing ticket, redirect to its details page
    // this needs to be done after catch because throws a special redirect exception
    await setCookieByKey('toastMessage', 'Ticket updated successfully');
    redirect(ticketDetailsPath(ticketId));
  }

  return toActionState('Ticket created successfully');
};

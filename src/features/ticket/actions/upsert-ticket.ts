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
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { ticketUpsertSchema } from '@/features/ticket/schemas/form-schemas';
import prisma from '@/lib/prisma';
import { toCentsFromCurrency } from '@/utils/currency';

import { getTicketAndCheckOwner } from '../queries/get-ticket-check-owner';

export const upsertTicket = async (
  ticketId: string | undefined,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const { user: authUser } = await getAuthOrRedirect();

  try {
    // ensure correct permission to edit ticket
    //  ie are the owner - if no user already redirecting so handled the create case
    //  needle to handle edit case and ensure user is the owner

    if (ticketId) {
      // check if user has permission - ie is ticketOwner
      const { isAllowed, message } = await getTicketAndCheckOwner(ticketId, authUser);

      // if do not have permission ie is not owner or could not find ticket for some reason
      if (!isAllowed) return toActionState(message, 'ERROR');
    }

    const result = ticketUpsertSchema.safeParse({
      title: formData.get('title'),
      content: formData.get('content'),
      bounty: formData.get('bounty'),
      deadline: formData.get('deadline'),
    });

    if (!result.success) {
      return fromErrorToActionState(result.error, formData);
    }

    const dbData = {
      ...result.data,
      bounty: toCentsFromCurrency(result.data.bounty),
      userId: authUser?.id,
    };

    await prisma.ticket.upsert({
      where: { id: ticketId || '' },
      update: dbData,
      create: dbData,
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

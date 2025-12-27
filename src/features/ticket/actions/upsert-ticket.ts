'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { ticketDetailsPath, ticketsPath } from '@/constants/paths';
import prisma from '@/lib/prisma';
import { ticketUpsertSchema } from '@/schemas/form-schemas';

type UpsertActionState = {
  message: string;
  payload?: FormData;
};

export const upsertTicket = async (
  ticketId: string | undefined,
  _prevState: UpsertActionState,
  formData: FormData
): Promise<UpsertActionState> => {
  const ticketData = ticketUpsertSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!ticketData.success) {
    return { message: 'Invalid ticket data provided.', payload: formData };
  }

  await prisma.ticket.upsert({
    where: { id: ticketId || '' },
    update: ticketData.data,
    create: ticketData.data,
  });

  revalidatePath(ticketsPath);
  if (ticketId) {
    redirect(ticketDetailsPath(ticketId));
  }

  return { message: 'Ticket created successfully', payload: formData };
};

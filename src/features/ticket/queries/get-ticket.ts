import { prisma } from '@/lib/prisma';

import { type Ticket } from '../types';

export const getTicket = async (ticketId: string): Promise<Ticket | null> => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });
  return ticket;
};

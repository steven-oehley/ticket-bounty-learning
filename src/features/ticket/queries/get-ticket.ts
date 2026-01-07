import { prisma } from '@/lib/prisma';

import { type TicketWithUser } from '../types';

export const getTicket = async (ticketId: string): Promise<TicketWithUser | null> => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      user: {
        select: {
          username: true,
          id: true,
        },
      },
    },
  });
  return ticket;
};

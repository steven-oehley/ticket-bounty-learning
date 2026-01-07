import { prisma } from '@/lib/prisma';

import { type TicketWithUser } from '../types';

export const getTickets = async (): Promise<TicketWithUser[]> => {
  const tickets = await prisma.ticket.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          username: true,
          id: true,
        },
      },
    },
  });
  return tickets;
};

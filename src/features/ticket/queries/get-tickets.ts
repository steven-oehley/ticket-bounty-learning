import { prisma } from '@/lib/prisma';

import { type TicketWithUser } from '../types';

export const getTickets = async (userId: string | undefined): Promise<TicketWithUser[]> => {
  const tickets = await prisma.ticket.findMany({
    where: { userId }, // if undefined then prisma ignores so we get all tickets
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

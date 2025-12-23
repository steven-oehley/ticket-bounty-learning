import { type Ticket } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export const getTickets = async (): Promise<Ticket[]> => {
  const tickets = await prisma.ticket.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return tickets;
};

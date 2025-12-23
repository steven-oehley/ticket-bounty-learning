import { type Ticket } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export const getTicket = async (ticketId: string): Promise<Ticket | null> => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });
  return ticket;
};

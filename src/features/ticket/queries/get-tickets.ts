import { prisma } from '@/lib/prisma';

import { type Ticket } from '../types';

export const getTickets = async (): Promise<Ticket[]> => {
  const tickets = await prisma.ticket.findMany();
  return tickets;
};

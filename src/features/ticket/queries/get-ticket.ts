import { initialTickets } from '@/data/data';

import { type Ticket } from '../types';

export const getTicket = async (ticketId: string): Promise<Ticket | null> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const foundTicket = initialTickets.find((t) => t.id === ticketId);
  return foundTicket || null;
};

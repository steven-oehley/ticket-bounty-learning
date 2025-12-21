import { initialTickets } from '@/data/data';

import { type Ticket } from '../types';

export const getTickets = async (): Promise<Ticket[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return initialTickets;
};

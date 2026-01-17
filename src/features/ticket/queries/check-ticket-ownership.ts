import { isTicketOwner } from '@/features/auth/utils/is-ticket-owner';
import { type User as AuthUser } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';

export const checkTicketOwnership = async (ticketId: string, authUser: AuthUser) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    return { isAuthorised: false, message: 'Ticket not found' };
  }

  const isOwner = isTicketOwner(authUser, ticket);

  if (!isOwner) {
    return { isAuthorised: false, message: 'You are not authorised for this action' };
  }

  return { isAuthorised: true, message: '' };
};

import { type Prisma } from '@/generated/prisma/client';

export type TicketWithUser = Prisma.TicketGetPayload<{
  include: {
    user: {
      select: {
        username: true;
        id: true;
      };
    };
  };
}>;

import { type User as AuthUser } from '@/generated/prisma/client';

type Entity = {
  userId: string | null;
};

export const isTicketOwner = (
  authUser: AuthUser | null | undefined,
  entity: Entity | null | undefined
) => {
  if (!authUser?.id || !entity?.userId) return false;

  return authUser.id === entity.userId;
};

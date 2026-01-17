import { LucideTrash2 } from 'lucide-react';

import ConfirmDialog from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { getAuth } from '@/features/auth/actions/get-auth';
import { isTicketOwner } from '@/features/auth/utils/is-ticket-owner';
import { deleteTicketAction } from '@/features/ticket/actions/delete-ticket';
import { type Ticket } from '@/generated/prisma/client';

interface DeleteBtnProps {
  ticket: Ticket;
}

const DeleteBtn = async ({ ticket }: DeleteBtnProps) => {
  const { user: authUser } = await getAuth();
  const isOwner = isTicketOwner(authUser, ticket);

  if (!isOwner) return null;
  return (
    <ConfirmDialog
      action={deleteTicketAction.bind(null, ticket.id)}
      description="This action can not be undone. Once the ticket is deleted, it is lost forever."
      title="Are you sure you want to delete this ticket?"
      trigger={
        <Button className="cursor-pointer" size="icon" variant="outline">
          <LucideTrash2 />
        </Button>
      }
    />
  );
};
export default DeleteBtn;

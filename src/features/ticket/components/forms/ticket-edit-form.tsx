import Form from 'next/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { editTicket } from '@/features/ticket/actions/edit-ticket';
import { type Ticket } from '@/generated/prisma/client';

interface TicketEditFormProps {
  ticket: Ticket;
}

const TicketEditForm = ({ ticket }: TicketEditFormProps) => {
  return (
    <Form action={editTicket.bind(null, ticket.id)} className="flex flex-col gap-y-4">
      <Label htmlFor="title">Title</Label>
      <Input
        required
        defaultValue={ticket.title}
        id="title"
        name="title"
        placeholder="Ticket title here..."
        type="text"
      />
      <Label htmlFor="content">Description</Label>
      <Textarea
        required
        defaultValue={ticket.content}
        id="content"
        name="content"
        placeholder="Ticket description here..."
      />
      <Button type="submit">Edit Ticket</Button>
    </Form>
  );
};
export default TicketEditForm;

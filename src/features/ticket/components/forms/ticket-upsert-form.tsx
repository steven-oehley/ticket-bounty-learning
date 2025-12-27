'use client';

import { useActionState } from 'react';
import Form from 'next/form';

import SubmitBtn from '@/components/form/submit-btn';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type Ticket } from '@/generated/prisma/client';

import { upsertTicket } from '../../actions/upsert-ticket';

interface TicketUpsertFormProps {
  ticket?: Ticket;
}

const TicketUpsertForm = ({ ticket }: TicketUpsertFormProps) => {
  const [ticketUpsertState, ticketUpsertAction, isPending] = useActionState(
    upsertTicket.bind(null, ticket?.id),
    { message: '' }
  );
  return (
    <Form action={ticketUpsertAction} className="flex flex-col gap-y-4">
      <Label htmlFor="title">Title</Label>
      <Input
        required
        defaultValue={ticket?.title || ''}
        id="title"
        name="title"
        placeholder="Ticket title here..."
        type="text"
      />
      <Label htmlFor="content">Description</Label>
      <Textarea
        required
        defaultValue={ticket?.content || ''}
        id="content"
        name="content"
        placeholder="Ticket description here..."
      />
      <SubmitBtn isDisabled={isPending} label={ticket ? 'Update Ticket' : 'Create Ticket'} />
      {ticketUpsertState?.message && <span>{ticketUpsertState?.message}</span>}
    </Form>
  );
};
export default TicketUpsertForm;

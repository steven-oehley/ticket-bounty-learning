'use client';

import { useActionState } from 'react';
import Form from 'next/form';

import FieldError from '@/components/form/field-error';
import SubmitBtn from '@/components/form/submit-btn';
import { EMPTY_ACTION_STATE } from '@/components/form/utils/to-action-state';
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
    EMPTY_ACTION_STATE
  );
  return (
    <Form action={ticketUpsertAction} className="flex flex-col gap-y-4">
      <Label htmlFor="title">Title</Label>
      <Input
        required
        defaultValue={(ticketUpsertState.payload?.get('title') as string) ?? ticket?.title}
        id="title"
        name="title"
        placeholder="Ticket title here..."
        type="text"
      />
      {ticketUpsertState?.fieldErrors?.title?.[0] && (
        <FieldError actionState={ticketUpsertState} name="title" />
      )}
      <Label htmlFor="content">Description</Label>
      <Textarea
        required
        defaultValue={(ticketUpsertState.payload?.get('content') as string) ?? ticket?.content}
        id="content"
        name="content"
        placeholder="Ticket description here..."
      />
      {ticketUpsertState?.fieldErrors?.content?.[0] && (
        <FieldError actionState={ticketUpsertState} name="content" />
      )}
      <SubmitBtn isDisabled={isPending} label={ticket ? 'Update Ticket' : 'Create Ticket'} />
      {ticketUpsertState?.message && (
        <span className="text-red-500">{ticketUpsertState?.message}</span>
      )}
    </Form>
  );
};
export default TicketUpsertForm;

'use client';

import { useActionState } from 'react';

import DatePicker from '@/components/date-picker';
import FieldError from '@/components/form/field-error';
import Form from '@/components/form/form';
import SubmitBtn from '@/components/form/submit-btn';
import { EMPTY_ACTION_STATE } from '@/components/form/utils/to-action-state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type Ticket } from '@/generated/prisma/client';
import { toCurrencyFromCents } from '@/utils/currency';

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
    <Form
      action={ticketUpsertAction}
      actionState={ticketUpsertState}
      className="flex flex-col gap-y-4"
    >
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
      <div className="flex items-start justify-between space-x-4">
        <div className="flex w-1/2 flex-col space-y-2">
          <Label htmlFor="deadline">Deadline</Label>
          {/* <Input
            required
            defaultValue={
              (ticketUpsertState.payload?.get('deadline') as string) ?? ticket?.deadline
            }
            id="deadline"
            name="deadline"
            placeholder="Ticket deadline here..."
            type="date"
          /> */}
          <DatePicker
            key={ticketUpsertState.timeStamp}
            defaultValue={
              (ticketUpsertState.payload?.get('deadline') as string) ?? ticket?.deadline
            }
            id="deadline"
            name="deadline"
          />
          {ticketUpsertState?.fieldErrors?.deadline?.[0] && (
            <FieldError actionState={ticketUpsertState} name="deadline" />
          )}
        </div>
        <div className="flex w-1/2 flex-col space-y-2">
          <Label htmlFor="bounty">Bounty</Label>
          <Input
            required
            defaultValue={
              (ticketUpsertState.payload?.get('bounty') as string) ??
              (ticket?.bounty ? toCurrencyFromCents(ticket?.bounty) : '')
            }
            id="bounty"
            name="bounty"
            placeholder="Ticket bounty here..."
            step="0.01"
            type="number"
          />
          {ticketUpsertState?.fieldErrors?.bounty?.[0] && (
            <FieldError actionState={ticketUpsertState} name="bounty" />
          )}
        </div>
      </div>
      <SubmitBtn isDisabled={isPending} label={ticket ? 'Update Ticket' : 'Create Ticket'} />
    </Form>
  );
};
export default TicketUpsertForm;

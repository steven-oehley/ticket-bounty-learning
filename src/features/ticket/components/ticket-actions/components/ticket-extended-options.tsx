'use client';
import { LucideMoreVertical, LucideTestTube } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { updateTicketStatus } from '@/features/ticket/actions/update-ticket-status';
import { TICKET_ICONS } from '@/features/ticket/constants';
import { type Ticket, type TicketStatus } from '@/generated/prisma/client';

interface TicketExtendedOptionsProps {
  ticket: Ticket;
}

const TicketExtendedOptions = ({ ticket }: TicketExtendedOptionsProps) => {
  const handleStatusChange = async (value: string) => {
    const promise = updateTicketStatus(ticket.id, value as TicketStatus);

    toast.promise(promise, {
      loading: 'Updating ticket status...',
    });

    const result = await promise;

    if (result.status === 'ERROR') toast.error(result.message);
    else if (result.status === 'SUCCESS') toast.success(result.message);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="cursor-pointer" size="icon" variant="outline">
          <LucideMoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="right">
        <DropdownMenuLabel>Ticket Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={ticket.status} onValueChange={handleStatusChange}>
          {Object.entries(TICKET_ICONS).map(([status, icon]) => (
            <DropdownMenuRadioItem key={status} className="cursor-pointer" value={status}>
              {icon}
              <span>{status}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Other Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" id={ticket.id}>
          <LucideTestTube />
          <span>Test</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default TicketExtendedOptions;

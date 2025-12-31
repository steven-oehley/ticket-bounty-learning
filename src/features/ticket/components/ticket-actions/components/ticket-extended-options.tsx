import { LucideMoreVertical, LucideTestTube } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Ticket } from '@/generated/prisma/client';

interface TicketExtendedOptionsProps {
  ticket: Ticket;
}

const TicketExtendedOptions = ({ ticket }: TicketExtendedOptionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <LucideMoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="right">
        <DropdownMenuItem className="cursor-pointer" id={ticket.id}>
          <LucideTestTube />
          <span>Test</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default TicketExtendedOptions;

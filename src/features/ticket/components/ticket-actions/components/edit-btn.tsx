import Link from 'next/link';

import { LucidePencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ticketEditPath } from '@/constants/paths';

interface EditBtnProps {
  ticketId: string;
}
const EditBtn = ({ ticketId }: EditBtnProps) => {
  return (
    <Button asChild size="icon" variant="outline">
      {/* prefetch happens when link enters viewport */}
      <Link prefetch href={ticketEditPath(ticketId)}>
        <LucidePencil />
      </Link>
    </Button>
  );
};
export default EditBtn;

import Link from 'next/link';

import { LucideArrowBigLeft, LucideScanEye } from 'lucide-react';

import { Placeholder } from '@/components/placeholder';
import { Button } from '@/components/ui/button';
import { ticketsPath } from '@/constants/paths';

const NotFound = () => {
  return (
    <Placeholder
      button={
        <Button asChild variant="outline">
          <Link href={ticketsPath}>
            <LucideArrowBigLeft />
            Back To Tickets
          </Link>
        </Button>
      }
      Icon={LucideScanEye}
      label="Ticket not found"
    />
  );
};
export default NotFound;

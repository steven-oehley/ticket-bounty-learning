import { LucideArrowBigLeft, LucideScanEye } from 'lucide-react';

import { Placeholder } from '@/components/placeholder';
import { Button } from '@/components/ui/button';
import { ticketsPath } from '@/constants/paths';

const NotFound = () => {
  return (
    <Placeholder
      button={
        <Button asChild variant="outline">
          {/* current Nextjs issue prevents the use of Link with loading.tsx - tracking issue here 
          ---> https://github.com/vercel/next.js/issues/86151 */}
          <a href={ticketsPath}>
            <LucideArrowBigLeft />
            Back To Tickets
          </a>
        </Button>
      }
      Icon={LucideScanEye}
      label="Ticket not found"
    />
  );
};
export default NotFound;

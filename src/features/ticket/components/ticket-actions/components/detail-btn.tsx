import Link from 'next/link';

import { LucideEye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ticketDetailsPath } from '@/constants/paths';

interface DetailBtnProps {
  ticketId: string;
}

const DetailBtn = ({ ticketId }: DetailBtnProps) => {
  return (
    <Button asChild size="icon" variant="outline">
      {/* prefetch happens when link enters viewport */}
      <Link prefetch href={ticketDetailsPath(ticketId)}>
        <LucideEye />
      </Link>
    </Button>
  );
};
export default DetailBtn;

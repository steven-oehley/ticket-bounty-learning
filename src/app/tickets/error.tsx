// Errors bubble up
// This error boundary therefore handles errors thrown in the ticket listing page and indivuidual ticket details page
'use client';

import Link from 'next/link';

import { LucideArrowBigLeft } from 'lucide-react';

import { Placeholder } from '@/components/placeholder';
import { Button } from '@/components/ui/button';
import { homePath } from '@/constants/paths';

const Error = ({ error }: { error: Error }) => {
  return (
    <Placeholder
      button={
        <Button asChild variant="outline">
          <Link href={homePath}>
            <LucideArrowBigLeft />
            Back To Home
          </Link>
        </Button>
      }
      label={error.message || 'Something went wrong while loading tickets.'}
    />
  );
};
export default Error;

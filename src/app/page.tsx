import { Suspense } from 'react';

import { Heading } from '@/components/heading';
import LoaderSpinner from '@/components/loader-spinner';
import TicketList from '@/features/ticket/components/ticket-list';

const HomePage = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading description="View all tickets on Ticket Bounty" title="All Tickets" />
      <Suspense fallback={<LoaderSpinner />}>
        <TicketList />
      </Suspense>
    </div>
  );
};

export default HomePage;

import { Suspense } from 'react';

import { Heading } from '@/components/heading';
import LoaderSpinner from '@/components/loader-spinner';
import TicketList from '@/features/ticket/components/ticket-list';

const TicketsPage = async () => {
  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading description="All your tickets at one place" title="Tickets" />
      {/* In order to suspend the data fetching needs to happen inside the Suspense */}
      {/* This is why we refactored to separate TicketList with data fetching there and then wrapped in Suspense */}

      {/* Could have used an ErrorBoundary here if wanted more fine grain control - react-error-boundary library */}
      <Suspense fallback={<LoaderSpinner />}>
        <TicketList />
      </Suspense>
    </div>
  );
};

export default TicketsPage;

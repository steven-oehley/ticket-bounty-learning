import { Suspense } from 'react';

import { Heading } from '@/components/heading';
import LoaderSpinner from '@/components/loader-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TicketList from '@/features/ticket/components/ticket-list';

// ----------------------------------------------------------------
//  CACHING NOTE FOR NEXT.JS 13+ APPS DIRECTORY
// ----------------------------------------------------------------

// Next.js statically generates pages by default, even with database queries.
// Your /tickets page is being rendered at build time with whatever data existed then.

//   This means:
//   - The page shows stale data from build time
//   - New tickets won't appear until you rebuild

//   To make it dynamic (fetch fresh data on each request), add this to your tickets page:

//   export const dynamic = 'force-dynamic';

//   Or use ISR (revalidate periodically):

//   export const revalidate = 60; // Refresh every 60 seconds if we can predict how often data changes
//   of if we cant predict (based on user activity) then use 'revaidatePath' or 'revalidateTag' in server actions

//   The /tickets/[ticketId] route is dynamic (ƒ) because it has a dynamic segment [ticketId]
// that can't be known at build time (unless you use generateStaticParams).

// ----------------------------------------------------------------
// TIME BASED REVALIDATION (ISR) STRATEGY
// ----------------------------------------------------------------
// export const revalidate = 30; // Revalidate this page every 30 seconds

const TicketsPage = async () => {
  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading description="All your tickets at one place" title="Tickets" />
      {/* In order to suspend the data fetching needs to happen inside the Suspense */}
      {/* This is why we refactored to separate TicketList with data fetching there and then wrapped in Suspense */}

      {/* Could have used an ErrorBoundary here if wanted more fine grain control - react-error-boundary library */}

      <Card className="w-full max-w-105 self-center">
        <CardHeader>
          <CardTitle>Create A New Ticket</CardTitle>
          <CardDescription>A new ticket will be created for your issue</CardDescription>
        </CardHeader>
        <CardContent>TicketCreateForm</CardContent>
      </Card>
      <Suspense fallback={<LoaderSpinner />}>
        <TicketList />
      </Suspense>
    </div>
  );
};

export default TicketsPage;

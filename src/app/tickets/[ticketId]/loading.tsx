import { LucideLoader2 } from 'lucide-react';

// This could have been placed higher and would bubble up to tickets page
//  Would then work for both ticket listing and ticket details page
//  But have placed here to show then how suspense can be used as well in the listing page.

const Loading = () => {
  // Using a loading.tsx on ticket details page to show a spinner while the ticket data is being fetched
  // Less granular than Suspense but it is an alternative for loading states on a per-route basis - less fine grained
  return (
    <div className="flex flex-1 flex-col items-center justify-center self-center" role="status">
      <LucideLoader2 className="h-10 w-10 animate-spin text-gray-600" />
    </div>
  );
};
export default Loading;

import { LucideLoader2 } from 'lucide-react';

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

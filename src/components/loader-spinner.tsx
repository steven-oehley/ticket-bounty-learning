import { LucideLoader2 } from 'lucide-react';

const LoaderSpinner = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center self-center" role="status">
      <LucideLoader2 className="h-10 w-10 animate-spin text-gray-600" />
    </div>
  );
};
export default LoaderSpinner;

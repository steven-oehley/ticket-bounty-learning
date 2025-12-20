import Link from 'next/link';

import { Heading } from '@/components/heading';
import { ticketsPath } from '@/constants/paths';

const HomePage = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading description="Your home place to start" title="Home" />
      <div className="flex flex-1 flex-col items-center">
        <Link className="text-sm underline" href={ticketsPath}>
          Go to Tickets
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

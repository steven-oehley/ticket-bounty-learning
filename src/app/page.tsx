import { ticketsPath } from '@/constants/paths';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Home</h2>
        <p className="text-muted-foreground text-sm">Your home place to start</p>
      </div>

      <div className="flex flex-1 flex-col items-center">
        <Link className="text-sm underline" href={ticketsPath}>
          Go to Tickets
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

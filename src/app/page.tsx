import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <h2 className="text-lg">HomePage</h2>

      <Link className="underline" href="/tickets">
        Go to Tickets
      </Link>
    </div>
  );
};

export default HomePage;

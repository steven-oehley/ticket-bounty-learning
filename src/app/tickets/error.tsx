// Errors bubble up
// This error boundary therefore handles errors thrown in the ticket listing page and indivuidual ticket details page
'use client';

import { Placeholder } from '@/components/placeholder';

const Error = ({ error }: { error: Error }) => {
  return <Placeholder label={error.message || 'Something went wrong while loading tickets.'} />;
};
export default Error;

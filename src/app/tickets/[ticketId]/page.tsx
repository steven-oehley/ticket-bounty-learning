import { notFound } from 'next/navigation';

import { TicketItem } from '@/features/ticket/components/ticket-item';
import { getTicket } from '@/features/ticket/queries/get-ticket';
// import { prisma } from '@/lib/prisma';

interface TicketPageProps {
  params: Promise<{
    ticketId: string;
  }>;
}

const TicketPage = async ({ params }: TicketPageProps) => {
  const { ticketId } = await params;
  const foundTicket = await getTicket(ticketId);

  if (!foundTicket) {
    notFound();
  }

  return (
    <div className="animate-in fade-in slide-in-from-top flex justify-center duration-400">
      <TicketItem isDetailView ticket={foundTicket} />
    </div>
  );
};

// export const generateStaticParams = async () => {
// If you wanted to pre-render specific tickets at build time, you could fetch their IDs here
// ie change from dynamic to static generation with this function
// For example, fetch the most popular tickets or recent tickets
// const tickets = await prisma.ticket.findMany({ take: 10, select: { id: true } });
// return tickets.map((ticket) => ({
//   ticketId: ticket.id,
// }));
// };

// If we did this we would also need to revalidate the individual ticket pages when tickets are updated or deleted
// using revalidatePath or revalidateTag in the server actions that modify tickets with specific IDs

export default TicketPage;

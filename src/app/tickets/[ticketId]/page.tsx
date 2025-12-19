import { initialTickets } from '@/data/data';

interface TicketPageProps {
  params: Promise<{
    ticketId: string;
  }>;
}

const TicketPage = async ({ params }: TicketPageProps) => {
  const { ticketId } = await params;
  const foundTicket = initialTickets.find((ticket) => ticket.id === ticketId);

  if (!foundTicket) {
    return <div>Ticket not found</div>;
  }

  return (
    <div>
      <h2 className="text-lg">{foundTicket.title}</h2>
      <p className="text-sm">{foundTicket.content}</p>
    </div>
  );
};

export default TicketPage;

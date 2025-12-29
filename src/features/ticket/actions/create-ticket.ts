// 'use server';

// import { revalidatePath } from 'next/cache';

// import { ticketsPath } from '@/constants/paths';
// import { prisma } from '@/lib/prisma';

// export const createTicket = async (formData: FormData) => {
//   const ticketData = {
//     title: formData.get('title') as string,
//     content: formData.get('content') as string,
//   };

//   await prisma.ticket.create({
//     data: ticketData,
//   });

//   revalidatePath(ticketsPath);
// };

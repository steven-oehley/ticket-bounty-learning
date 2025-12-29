import 'dotenv/config';

import { PrismaNeon } from '@prisma/adapter-neon';

import { PrismaClient } from '@/generated/prisma/client';

// Seed script runs standalone, needs its own client
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const tickets = [
  {
    title: 'Fix authentication bug',
    content:
      'Users are unable to log in after password reset. The session token is not being refreshed properly after the password change flow completes.',
    bounty: 450,
    deadline: new Date().toISOString().split('T')[0],
    status: 'OPEN' as const,
  },
  {
    title: 'Add dark mode support',
    content:
      'Implement a dark mode toggle in the settings page. Should persist user preference in localStorage and respect system preferences by default.',
    bounty: 299,
    deadline: new Date().toISOString().split('T')[0],
    status: 'IN_PROGRESS' as const,
  },
  {
    title: 'Optimize database queries',
    content:
      'The ticket listing page is slow due to N+1 query issues. Need to implement proper eager loading for related user and comment data.',
    bounty: 199,
    deadline: new Date().toISOString().split('T')[0],
    status: 'DONE' as const,
  },
  {
    title: 'Implement email notifications',
    content:
      'Send email notifications when a ticket is assigned, status changes, or a new comment is added. Use a queue system to handle high volume.',
    bounty: 799,
    deadline: new Date().toISOString().split('T')[0],
    status: 'OPEN' as const,
  },
  {
    title: 'Add file attachment support',
    content:
      'Allow users to attach files (images, PDFs, documents) to tickets. Max file size 10MB, stored in S3 with signed URLs for access.',
    bounty: 789,
    deadline: new Date().toISOString().split('T')[0],
    status: 'IN_PROGRESS' as const,
  },
];

const seed = async () => {
  const t0 = performance.now();
  console.info('🌱 Seeding database...');

  console.info('🗑️  Clearing existing tickets...');
  await prisma.ticket.deleteMany();

  console.info(`📝 Creating ${tickets.length} tickets...`);
  await prisma.ticket.createMany({
    data: tickets,
  });

  const t1 = performance.now();
  console.info(`✅ Seeding complete! (${(t1 - t0).toFixed(2)}ms)`);
};

seed();

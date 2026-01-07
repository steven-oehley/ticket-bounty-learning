import 'dotenv/config';

import { hash } from '@node-rs/argon2';
import { PrismaNeon } from '@prisma/adapter-neon';

import { PrismaClient } from '@/generated/prisma/client';

// Seed script runs standalone, needs its own client
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const users = [
  {
    username: 'admin',
    email: 'admin@admin.com',
  },
  {
    username: 'user',
    email: 'sjoehley@outlook.com',
  },
];

const tickets = [
  {
    title: 'Fix authentication bug',
    content:
      'Users are unable to log in after password reset. The session token is not being refreshed properly after the password change flow completes.',
    bounty: 4500,
    deadline: new Date().toISOString().split('T')[0],
    status: 'OPEN' as const,
  },
  {
    title: 'Add dark mode support',
    content:
      'Implement a dark mode toggle in the settings page. Should persist user preference in localStorage and respect system preferences by default.',
    bounty: 2999,
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
    bounty: 8000,
    deadline: new Date().toISOString().split('T')[0],
    status: 'OPEN' as const,
  },
  {
    title: 'Add file attachment support',
    content:
      'Allow users to attach files (images, PDFs, documents) to tickets. Max file size 10MB, stored in S3 with signed URLs for access.',
    bounty: 78460,
    deadline: new Date().toISOString().split('T')[0],
    status: 'IN_PROGRESS' as const,
  },
];

const seed = async () => {
  const t0 = performance.now();
  console.info('🌱 Seeding database...');

  console.info('🗑️  Clearing existing tickets and users...');
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  console.info(`📝 Creating ${tickets.length} tickets and ${users.length} users...`);

  const passwordHash = await hash('password2026');

  const dbUsers = await prisma.user.createManyAndReturn({
    data: users.map((user) => ({
      ...user,
      passwordHash,
    })),
  });

  await prisma.ticket.createMany({
    data: tickets.map((ticket) => ({
      ...ticket,
      userId: dbUsers[0].id,
    })),
  });

  const t1 = performance.now();
  console.info(`✅ Seeding complete! (${(t1 - t0).toFixed(2)}ms)`);
};

seed();

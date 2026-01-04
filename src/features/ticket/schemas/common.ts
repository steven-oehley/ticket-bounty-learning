import { z } from 'zod';

export const ticketTitleSchema = z
  .string({ error: 'Title must be text' })
  .trim()
  .min(8, 'Title must be at least 8 characters')
  .max(100, 'Title must be at most 100 characters');

export const ticketContentSchema = z
  .string({ error: 'Content must be text' })
  .trim()
  .min(20, 'Content must be at least 20 characters')
  .max(1024, 'Content must be at most 1024 characters');

export const ticketBountySchema = z.coerce.number().min(1, 'Bounty must be at least R1');

export const ticketDeadlineSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Deadline is required and must be in YYYY-MM-DD format');

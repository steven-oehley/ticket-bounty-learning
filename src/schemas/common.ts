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

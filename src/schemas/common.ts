import { z } from 'zod';

export const ticketTitleSchema = z
  .string({ error: 'Title must be text' })
  .min(1, 'Title is required')
  .max(100, 'Title must be at most 100 characters');

export const ticketContentSchema = z
  .string({ error: 'Content must be text' })
  .min(1, 'Content is required')
  .max(1024, 'Content must be at most 1000 characters');

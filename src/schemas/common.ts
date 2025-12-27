import { z } from 'zod';

export const ticketTitleSchema = z
  .string({ error: 'Title must be text' })
  .min(8, 'Title is required and must be at least 8 characters')
  .max(100, 'Title must be at most 100 characters');

export const ticketContentSchema = z
  .string({ error: 'Content must be text' })
  .min(20, 'Content is required and must be at least 20 characters')
  .max(1024, 'Content must be at most 1024 characters');

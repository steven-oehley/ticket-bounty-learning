import { z } from 'zod';

import { ticketContentSchema, ticketTitleSchema } from './common';

export const ticketUpsertSchema = z.object({
  title: ticketTitleSchema,
  content: ticketContentSchema,
});

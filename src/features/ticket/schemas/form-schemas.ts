import { z } from 'zod';

import {
  ticketBountySchema,
  ticketContentSchema,
  ticketDeadlineSchema,
  ticketTitleSchema,
} from './common';

export const ticketUpsertSchema = z.object({
  title: ticketTitleSchema,
  content: ticketContentSchema,
  bounty: ticketBountySchema,
  deadline: ticketDeadlineSchema,
});

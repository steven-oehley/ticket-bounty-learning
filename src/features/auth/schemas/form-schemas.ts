import { z } from 'zod';

import { emailSchema, passwordSchema, usernameSchema } from './common';

export const signUpSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // This attaches the error to confirmPassword field
  });

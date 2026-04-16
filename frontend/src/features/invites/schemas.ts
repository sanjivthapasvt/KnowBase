// src/features/invites/schemas.ts
import { z } from 'zod';

export const InviteSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  role: z.enum(['admin', 'member', 'viewer']),
});

export type InviteFormData = z.infer<typeof InviteSchema>;

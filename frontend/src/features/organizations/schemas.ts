// src/features/organizations/schemas.ts
import { z } from 'zod';

export const CreateOrgSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(1000).optional(),
});

export type CreateOrgFormData = z.infer<typeof CreateOrgSchema>;

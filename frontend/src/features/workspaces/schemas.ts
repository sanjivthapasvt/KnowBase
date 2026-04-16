// src/features/workspaces/schemas.ts
import { z } from 'zod';

export const CreateWorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(1000).optional(),
});

export type CreateWorkspaceFormData = z.infer<typeof CreateWorkspaceSchema>;

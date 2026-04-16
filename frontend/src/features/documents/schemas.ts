// src/features/documents/schemas.ts
import { z } from 'zod';

export const CreateDocumentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  workspace_id: z.string().min(1, 'Workspace is required'),
  status: z.enum(['draft', 'published', 'archived']),
});

export const UpdateDocumentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

export type CreateDocumentFormData = z.infer<typeof CreateDocumentSchema>;
export type UpdateDocumentFormData = z.infer<typeof UpdateDocumentSchema>;

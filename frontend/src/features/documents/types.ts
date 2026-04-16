// src/features/documents/types.ts
export type DocumentStatus = 'draft' | 'published' | 'archived';

export interface Document {
  id: string;
  title: string;
  status: DocumentStatus;
  workspace_id: string;
  organization_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  current_version_id: string | null;
}

export interface CreateDocument {
  title: string;
  workspace_id: string;
  status?: DocumentStatus;
}

export interface UpdateDocument {
  title?: string;
  status?: DocumentStatus;
}

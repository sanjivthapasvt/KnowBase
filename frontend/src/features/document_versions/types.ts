// src/features/document_versions/types.ts
export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  title: string;
  content: string;
  created_by: string;
  organization_id: string;
  created_at: string;
}

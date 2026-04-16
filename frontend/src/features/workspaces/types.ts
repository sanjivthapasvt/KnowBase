// src/features/workspaces/types.ts
export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWorkspace {
  name: string;
  description?: string;
}

export interface UpdateWorkspace {
  name?: string;
  description?: string;
}

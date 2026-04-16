// src/features/organizations/types.ts
export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateOrganization {
  name: string;
  description?: string;
}

export interface UpdateOrganization {
  name?: string;
  description?: string;
}

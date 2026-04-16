// src/features/memberships/types.ts
export type RoleEnum = 'owner' | 'admin' | 'member' | 'viewer';

export interface Membership {
  id: string;
  user_id: string;
  organization_id: string;
  role: RoleEnum;
  created_at: string;
  updated_at: string;
}

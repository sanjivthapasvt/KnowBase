// src/features/invites/types.ts
export type InviteStatus = 'pending' | 'accepted' | 'expired' | 'revoked';

export interface Invite {
  id: string;
  email: string;
  token: string;
  role: string;
  status: InviteStatus;
  organization_id: string;
  invited_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateInvite {
  email: string;
  role?: string;
}

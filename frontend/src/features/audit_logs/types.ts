export interface AuditLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  user_id: string;
  organization_id: string;
  details: string | null;
  ip_address: string | null;
  created_at: string;
}

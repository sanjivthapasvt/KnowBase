// src/features/audit_logs/api.ts
import apiClient from '@/lib/api/client';
import type { CursorPage } from '@/types/api';
import type { AuditLog } from './types';

export const auditLogsApi = {
  list: async (
    orgId: string,
    params?: { action?: string; resource_type?: string; cursor?: string },
  ): Promise<CursorPage<AuditLog>> => {
    const res = await apiClient.get<CursorPage<AuditLog>>(`/organizations/${orgId}/audit-logs`, { params });
    return res.data;
  },
};

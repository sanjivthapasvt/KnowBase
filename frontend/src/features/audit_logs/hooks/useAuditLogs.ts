'use client';
import { useQuery } from '@tanstack/react-query';
import { auditLogsApi } from '../api';

export function useAuditLogs(orgId: string | null, filters?: { action?: string; resource_type?: string; cursor?: string }) {
  return useQuery({
    queryKey: ['audit-logs', orgId, filters],
    queryFn: () => auditLogsApi.list(orgId!, filters),
    enabled: !!orgId,
  });
}

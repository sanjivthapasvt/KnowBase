// theme: dark schema applied
'use client';
import Link from 'next/link';
import { Badge } from '@/shared/components/ui/Badge';
import { formatRelativeTime } from '@/shared/utils/formatDate';
import type { Document, DocumentStatus } from '../types';

const statusVariant: Record<DocumentStatus, 'default' | 'success' | 'warning' | 'danger'> = {
  draft: 'warning',
  published: 'success',
  archived: 'default',
};

interface Props { doc: Document; orgId: string; }

export function DocumentCard({ doc, orgId }: Props) {
  return (
    <Link href={`/documents/${doc.id}?org_id=${orgId}`}
      className="block bg-[rgb(var(--color-bg-surface-2))] border border-[rgb(var(--color-border-default))] rounded-xl p-5 hover:border-[#3a4255] transition-colors duration-150 active:bg-[rgb(var(--color-bg-surface-3))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-brand-default))] focus-visible:ring-offset-1 focus-visible:ring-offset-[rgb(var(--color-bg-base))]">
      <div className="flex items-start justify-between">
        <div className="h-8 w-8 rounded-md bg-[rgb(var(--color-warning-bg))] text-[rgb(var(--color-warning-text))] flex items-center justify-center">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        <Badge variant={statusVariant[doc.status]}>{doc.status}</Badge>
      </div>
      <h3 className="mt-3 text-[rgb(var(--color-text-primary))] font-medium line-clamp-1">{doc.title}</h3>
      <p className="mt-1.5 text-[rgb(var(--color-text-secondary))] text-xs line-clamp-2">{doc.title} ...</p>
      <div className="mt-4 pt-3 border-t-[0.5px] border-[rgb(var(--color-border-subtle))] bg-[rgb(var(--color-bg-surface-3))] rounded-lg px-3 py-2 flex items-center justify-between">
        <p className="text-[rgb(var(--color-text-muted))] text-xs">Updated {formatRelativeTime(doc.updated_at)}</p>
      </div>
    </Link>
  );
}

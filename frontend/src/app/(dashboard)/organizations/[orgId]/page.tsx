import OrgDetailClient from './OrgDetailClient';

export default async function OrgDetailPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  return <OrgDetailClient orgId={orgId} />;
}

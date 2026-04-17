import OrgDetailClient from './OrgDetailClient';

export default function OrgDetailPage({ params }: { params: { orgId: string } }) {
  return <OrgDetailClient orgId={params.orgId} />;
}

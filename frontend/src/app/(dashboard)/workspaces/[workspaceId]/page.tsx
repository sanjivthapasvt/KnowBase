import WorkspaceDetailClient from './WorkspaceDetailClient';

export default async function WorkspaceDetailPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params;
  return <WorkspaceDetailClient workspaceId={workspaceId} />;
}

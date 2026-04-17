import WorkspaceDetailClient from './WorkspaceDetailClient';

export default function WorkspaceDetailPage({ params }: { params: { workspaceId: string } }) {
  return <WorkspaceDetailClient workspaceId={params.workspaceId} />;
}

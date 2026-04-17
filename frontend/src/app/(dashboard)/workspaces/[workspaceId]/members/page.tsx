import MembersClient from './MembersClient';

export default function MembersPage({ params }: { params: { workspaceId: string } }) {
  return <MembersClient workspaceId={params.workspaceId} />;
}

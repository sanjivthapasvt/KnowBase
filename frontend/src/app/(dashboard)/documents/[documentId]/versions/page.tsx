import VersionsClient from './VersionsClient';

export default async function VersionsPage({ params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await params;
  return <VersionsClient documentId={documentId} />;
}

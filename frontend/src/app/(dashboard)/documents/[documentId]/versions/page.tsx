import VersionsClient from './VersionsClient';

export default function VersionsPage({ params }: { params: { documentId: string } }) {
  return <VersionsClient documentId={params.documentId} />;
}

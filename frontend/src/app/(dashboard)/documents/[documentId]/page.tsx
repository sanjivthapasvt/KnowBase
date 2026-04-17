import DocumentDetailClient from './DocumentDetailClient';

export default function DocumentDetailPage({ params }: { params: { documentId: string } }) {
  return <DocumentDetailClient documentId={params.documentId} />;
}

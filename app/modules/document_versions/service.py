from uuid import UUID

from app.core.exceptions import NotFoundException
from app.modules.document_versions.models import DocumentVersion
from app.modules.document_versions.repository import DocumentVersionRepository
from app.modules.document_versions.schemas import DocumentVersionCreate
from app.modules.documents.repository import DocumentRepository


class DocumentVersionService:
    """Business logic for document version operations."""

    def __init__(
        self, repo: DocumentVersionRepository, document_repo: DocumentRepository
    ):
        self.repo = repo
        self.document_repo = document_repo

    async def create_version(
        self,
        document_id: UUID,
        org_id: UUID,
        user_id: UUID,
        data: DocumentVersionCreate,
    ) -> DocumentVersion:
        """Create a new version snapshot for a document.

        Automatically increments the version number and updates
        the parent document's current_version_id.
        """
        # Verify document exists
        document = await self.document_repo.get_by_id(document_id, org_id)
        if not document:
            raise NotFoundException("Document not found")

        latest = await self.repo.get_latest_version_number(document_id)

        version = DocumentVersion(
            document_id=document_id,
            version_number=latest + 1,
            title=data.title,
            content=data.content,
            created_by=user_id,
            organization_id=org_id,
        )
        version = await self.repo.create(version)

        # Update the parent document to point to this new version
        document.current_version_id = version.id
        await self.document_repo.update(document)

        return version

    async def get_version(self, version_id: UUID, org_id: UUID) -> DocumentVersion:
        """Get a specific version by ID.

        Raises:
            NotFoundException: If the version does not exist.
        """
        version = await self.repo.get_by_id(version_id, org_id)
        if not version:
            raise NotFoundException("Document version not found")
        return version

    async def list_versions(
        self, document_id: UUID, org_id: UUID
    ) -> list[DocumentVersion]:
        """List all versions of a document."""
        return await self.repo.list_by_document(document_id, org_id)

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.document_versions.models import DocumentVersion


class DocumentVersionRepository:
    """Handles all database operations for document versions."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, version_id: UUID, org_id: UUID) -> DocumentVersion | None:
        """Fetch a document version by ID."""
        result = await self.db.execute(
            select(DocumentVersion).where(
                DocumentVersion.id == version_id,
                DocumentVersion.organization_id == org_id,
            )
        )
        return result.scalar_one_or_none()

    async def list_by_document(
        self, document_id: UUID, org_id: UUID
    ) -> list[DocumentVersion]:
        """List all versions of a document, ordered by version number desc."""
        result = await self.db.execute(
            select(DocumentVersion)
            .where(
                DocumentVersion.document_id == document_id,
                DocumentVersion.organization_id == org_id,
            )
            .order_by(DocumentVersion.version_number.desc())
        )
        return list(result.scalars().all())

    def get_document_versions_query(self, document_id: UUID, org_id: UUID):
        """Build a query for document versions (for pagination)."""
        return (
            select(DocumentVersion)
            .where(
                DocumentVersion.document_id == document_id,
                DocumentVersion.organization_id == org_id,
            )
            .order_by(DocumentVersion.version_number.desc(), DocumentVersion.id.desc())
        )

    async def get_latest_version_number(self, document_id: UUID) -> int:
        """Get the latest version number for a document."""
        result = await self.db.execute(
            select(func.coalesce(func.max(DocumentVersion.version_number), 0)).where(
                DocumentVersion.document_id == document_id
            )
        )
        return result.scalar_one()

    async def create(self, version: DocumentVersion) -> DocumentVersion:
        """Persist a new document version."""
        self.db.add(version)
        await self.db.flush()
        await self.db.refresh(version)
        return version

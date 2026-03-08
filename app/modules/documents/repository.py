from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.documents.models import Document


class DocumentRepository:
    """Handles all database operations for documents."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, doc_id: UUID, org_id: UUID) -> Document | None:
        """Fetch a document by ID, scoped to an organization."""
        result = await self.db.execute(
            select(Document).where(
                Document.id == doc_id,
                Document.organization_id == org_id,
            )
        )
        return result.scalar_one_or_none()

    async def list_by_workspace(
        self, workspace_id: UUID, org_id: UUID, *, skip: int = 0, limit: int = 100
    ) -> list[Document]:
        """List documents in a workspace."""
        result = await self.db.execute(
            select(Document)
            .where(
                Document.workspace_id == workspace_id,
                Document.organization_id == org_id,
            )
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def list_by_org(
        self, org_id: UUID, *, skip: int = 0, limit: int = 100
    ) -> list[Document]:
        """List all documents across workspaces for an organization."""
        result = await self.db.execute(
            select(Document)
            .where(Document.organization_id == org_id)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def create(self, document: Document) -> Document:
        """Persist a new document."""
        self.db.add(document)
        await self.db.flush()
        await self.db.refresh(document)
        return document

    async def update(self, document: Document) -> Document:
        """Update an existing document."""
        self.db.add(document)
        await self.db.flush()
        await self.db.refresh(document)
        return document

    async def delete(self, document: Document) -> None:
        """Delete a document."""
        await self.db.delete(document)
        await self.db.flush()

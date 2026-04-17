from uuid import UUID

from fastapi_pagination.cursor import CursorParams
from fastapi_pagination.ext.sqlalchemy import paginate

from app.core.exceptions import NotFoundException
from app.modules.documents.models import Document
from app.modules.documents.repository import DocumentRepository
from app.modules.documents.schemas import DocumentCreate, DocumentUpdate


class DocumentService:
    """Business logic for document operations."""

    def __init__(self, repo: DocumentRepository, db):
        self.repo = repo
        self.db = db

    async def create_document(
        self, org_id: UUID, user_id: UUID, data: DocumentCreate
    ) -> Document:
        """Create a new document in a workspace."""
        document = Document(
            title=data.title,
            status=data.status,
            workspace_id=data.workspace_id,
            organization_id=org_id,
            created_by=user_id,
        )
        return await self.repo.create(document)

    async def get_document(self, doc_id: UUID, org_id: UUID) -> Document:
        """Get a document by ID.

        Raises:
            NotFoundException: If the document does not exist.
        """
        document = await self.repo.get_by_id(doc_id, org_id)
        if not document:
            raise NotFoundException("Document not found")
        return document

    async def update_document(
        self, doc_id: UUID, org_id: UUID, data: DocumentUpdate
    ) -> Document:
        """Update a document.

        Raises:
            NotFoundException: If the document does not exist.
        """
        document = await self.repo.get_by_id(doc_id, org_id)
        if not document:
            raise NotFoundException("Document not found")

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(document, field, value)

        return await self.repo.update(document)

    async def delete_document(self, doc_id: UUID, org_id: UUID) -> None:
        """Delete a document.

        Raises:
            NotFoundException: If the document does not exist.
        """
        document = await self.repo.get_by_id(doc_id, org_id)
        if not document:
            raise NotFoundException("Document not found")
        await self.repo.delete(document)

    async def list_documents(
        self,
        org_id: UUID,
        workspace_id: UUID | None = None,
        *,
        params: CursorParams,
    ):
        """List documents, optionally filtered by workspace (cursor-paginated)."""
        query = self.repo.get_org_documents_query(org_id, workspace_id)
        return await paginate(self.db, query, params)

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.modules.documents.models import DocumentStatus


class DocumentCreate(BaseModel):
    """Schema for creating a document."""

    title: str
    workspace_id: UUID
    status: DocumentStatus = DocumentStatus.draft


class DocumentUpdate(BaseModel):
    """Schema for updating a document."""

    title: str | None = None
    status: DocumentStatus | None = None


class DocumentRead(BaseModel):
    """Schema for document responses."""

    id: UUID
    title: str
    status: DocumentStatus
    workspace_id: UUID
    organization_id: UUID
    created_by: UUID
    created_at: datetime
    updated_at: datetime
    current_version_id: UUID | None = None

    model_config = {"from_attributes": True}

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class DocumentVersionCreate(BaseModel):
    """Schema for creating a document version (internal use)."""

    title: str
    content: str


class DocumentVersionRead(BaseModel):
    """Schema for document version responses."""

    id: UUID
    document_id: UUID
    version_number: int
    title: str
    content: str
    created_by: UUID
    organization_id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}

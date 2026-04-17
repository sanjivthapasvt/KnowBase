from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, StringConstraints


class DocumentVersionCreate(BaseModel):
    """Schema for creating a document version (internal use)."""

    title: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=500)]
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

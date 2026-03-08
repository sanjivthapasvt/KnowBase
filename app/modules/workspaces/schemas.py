from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class WorkspaceCreate(BaseModel):
    """Schema for creating a workspace."""

    name: str
    description: str | None = None


class WorkspaceUpdate(BaseModel):
    """Schema for updating a workspace."""

    name: str | None = None
    description: str | None = None


class WorkspaceRead(BaseModel):
    """Schema for workspace responses."""

    id: UUID
    name: str
    slug: str
    description: str | None
    organization_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

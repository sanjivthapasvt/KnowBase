from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, StringConstraints


class WorkspaceCreate(BaseModel):
    """Schema for creating a workspace."""

    name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)]
    description: Annotated[
        str, StringConstraints(max_length=1000)
    ] | None = None


class WorkspaceUpdate(BaseModel):
    """Schema for updating a workspace."""

    name: Annotated[
        str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)
    ] | None = None
    description: Annotated[
        str, StringConstraints(max_length=1000)
    ] | None = None


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

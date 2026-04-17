from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, StringConstraints


class OrganizationCreate(BaseModel):
    """Schema for creating an organization."""

    name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)]
    description: Annotated[str, StringConstraints(max_length=1000)] | None = None


class OrganizationUpdate(BaseModel):
    """Schema for updating an organization."""

    name: (
        Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)]
        | None
    ) = None
    description: Annotated[str, StringConstraints(max_length=1000)] | None = None


class OrganizationRead(BaseModel):
    """Schema for organization responses."""

    id: UUID
    name: str
    slug: str
    description: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class OrganizationCreate(BaseModel):
    """Schema for creating an organization."""

    name: str
    description: str | None = None


class OrganizationUpdate(BaseModel):
    """Schema for updating an organization."""

    name: str | None = None
    description: str | None = None


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

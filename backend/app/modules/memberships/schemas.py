from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.modules.memberships.models import RoleEnum


class MembershipCreate(BaseModel):
    """Schema for adding a member to an organization."""

    user_id: UUID
    role: RoleEnum = RoleEnum.member


class MembershipUpdate(BaseModel):
    """Schema for updating a member's role."""

    role: RoleEnum


class MembershipRead(BaseModel):
    """Schema for membership responses."""

    id: UUID
    user_id: UUID
    organization_id: UUID
    role: RoleEnum
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

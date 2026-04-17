from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, EmailStr, StringConstraints

from app.modules.invites.models import InviteStatus
from app.modules.memberships.models import RoleEnum


class InviteCreate(BaseModel):
    """Schema for creating an invitation."""

    email: EmailStr
    role: RoleEnum = RoleEnum.member


class InviteRead(BaseModel):
    """Schema for invite responses."""

    id: UUID
    email: str
    token: str
    role: str
    status: InviteStatus
    organization_id: UUID
    invited_by: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class InviteAccept(BaseModel):
    """Schema for accepting an invitation."""

    token: Annotated[str, StringConstraints(min_length=1)]

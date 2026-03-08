from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr

from app.modules.invites.models import InviteStatus


class InviteCreate(BaseModel):
    """Schema for creating an invitation."""

    email: EmailStr
    role: str = "member"


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

    token: str

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    """Schema for creating a new user."""

    email: EmailStr
    password: str
    full_name: str


class UserUpdate(BaseModel):
    """Schema for updating a user profile."""

    full_name: str | None = None
    email: EmailStr | None = None


class UserRead(BaseModel):
    """Schema for user responses"""

    id: UUID
    email: str
    full_name: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

"""
User Pydantic schemas.
"""

import re
from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, EmailStr, StringConstraints, field_validator


class UserCreate(BaseModel):
    """Schema for creating a new user."""

    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=8, max_length=128)]
    full_name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)]

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        """Enforce password complexity rules."""
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?`~]", v):
            raise ValueError("Password must contain at least one special character")
        return v


class UserUpdate(BaseModel):
    """Schema for updating a user profile."""

    full_name: Annotated[
        str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)
    ] | None = None
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

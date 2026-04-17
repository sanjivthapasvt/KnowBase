"""
Auth Pydantic schemas.
"""

import re
from typing import Annotated

from pydantic import BaseModel, EmailStr, StringConstraints, field_validator


class RegisterRequest(BaseModel):
    """Schema for user registration."""

    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=8, max_length=128)]
    full_name: Annotated[
        str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)
    ]

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


class LoginRequest(BaseModel):
    """Schema for user login."""

    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=1)]


class TokenResponse(BaseModel):
    """Schema for JWT token pair response."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    """Schema for refreshing an access token."""

    refresh_token: Annotated[str, StringConstraints(min_length=1)]

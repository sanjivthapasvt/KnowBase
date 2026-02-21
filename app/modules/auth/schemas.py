"""
Auth Pydantic schemas.
"""

from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    """Schema for user registration."""

    email: EmailStr
    password: str
    full_name: str


class LoginRequest(BaseModel):
    """Schema for user login."""

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Schema for JWT token pair response."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    """Schema for refreshing an access token."""

    refresh_token: str

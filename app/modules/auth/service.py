"""
Auth service — handles registration, login, and token refresh.
"""

from uuid import UUID

from jose import JWTError

from app.core.exceptions import BadRequestException, ConflictException, UnauthorizedException
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.modules.auth.schemas import LoginRequest, RegisterRequest, TokenResponse
from app.modules.users.models import User
from app.modules.users.repository import UserRepository


class AuthService:
    """Business logic for authentication flows."""

    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def register(self, data: RegisterRequest) -> TokenResponse:
        """Register a new user and return token pair.

        Raises:
            ConflictException: If the email is already registered.
        """
        existing = await self.user_repo.get_by_email(data.email)
        if existing:
            raise ConflictException("Email already registered")

        user = User(
            email=data.email,
            hashed_password=hash_password(data.password),
            full_name=data.full_name,
        )
        user = await self.user_repo.create(user)

        return TokenResponse(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
        )

    async def login(self, data: LoginRequest) -> TokenResponse:
        """Authenticate a user and return token pair.

        Raises:
            UnauthorizedException: If credentials are invalid.
        """
        user = await self.user_repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.hashed_password):
            raise UnauthorizedException("Invalid email or password")
        if not user.is_active:
            raise UnauthorizedException("Account is deactivated")

        return TokenResponse(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
        )

    async def refresh(self, refresh_token: str) -> TokenResponse:
        """Issue a new access token from a valid refresh token.

        Raises:
            BadRequestException: If the refresh token is invalid.
        """
        try:
            payload = decode_token(refresh_token)
            if payload.get("type") != "refresh":
                raise BadRequestException("Invalid refresh token")
            user_id = UUID(payload["sub"])
        except (JWTError, KeyError, ValueError):
            raise BadRequestException("Invalid or expired refresh token") from None

        user = await self.user_repo.get_by_id(user_id)
        if not user or not user.is_active:
            raise BadRequestException("User not found or deactivated")

        return TokenResponse(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
        )

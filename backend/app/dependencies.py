"""
Shared application dependencies.

Provides reusable FastAPI dependencies for authentication,
tenant context resolution, and role-based access control.
"""

from uuid import UUID

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.core.security import decode_token
from app.modules.memberships.models import Membership, RoleEnum
from app.modules.users.models import User

bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Dependency: extract and validate the current user from the JWT token.

    Raises:
        UnauthorizedException: If the token is invalid or user does not exist.
    """
    try:
        payload = decode_token(credentials.credentials)
        user_id = payload.get("sub")
        token_type = payload.get("type")
        if user_id is None or token_type != "access":
            raise UnauthorizedException("Invalid token")
    except JWTError:
        raise UnauthorizedException("Invalid or expired token") from None

    result = await db.execute(select(User).where(User.id == UUID(user_id)))
    user = result.scalar_one_or_none()
    if user is None:
        raise UnauthorizedException("User not found")
    if not user.is_active:
        raise UnauthorizedException("User account is deactivated")
    return user


async def get_current_org_id(
    org_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UUID:
    """Dependency: resolve and validate organization context.

    Ensures the current user is a member of the specified organization.

    Args:
        org_id: Organization ID from path parameter.

    Raises:
        ForbiddenException: If user is not a member of the organization.
    """
    result = await db.execute(
        select(Membership).where(
            Membership.user_id == current_user.id,
            Membership.organization_id == org_id,
        )
    )
    membership = result.scalar_one_or_none()
    if membership is None:
        raise ForbiddenException("You are not a member of this organization")
    return org_id


def require_role(*allowed_roles: RoleEnum):
    """Factory dependency: check that the current user has one of the allowed roles.

    Usage::

        @router.post("/admin-only")
        async def admin_endpoint(
            org_id: UUID,
            user: User = Depends(get_current_user),
            _: None = Depends(require_role(RoleEnum.owner, RoleEnum.admin)),
        ):
            ...
    """

    async def role_checker(
        org_id: UUID,
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db),
    ) -> None:
        result = await db.execute(
            select(Membership).where(
                Membership.user_id == current_user.id,
                Membership.organization_id == org_id,
            )
        )
        membership = result.scalar_one_or_none()
        if membership is None or membership.role not in allowed_roles:
            raise ForbiddenException(
                f"Role '{membership.role if membership else 'none'}' is not allowed. "
                f"Required: {', '.join(r.value for r in allowed_roles)}"
            )

    return role_checker

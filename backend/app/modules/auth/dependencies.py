"""
Auth-specific dependencies.
"""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.auth.service import AuthService
from app.modules.users.repository import UserRepository


def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    """Dependency: instantiate the AuthService with a UserRepository."""
    return AuthService(UserRepository(db))

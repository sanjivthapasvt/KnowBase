from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies import get_current_user
from app.modules.users.models import User
from app.modules.users.repository import UserRepository
from app.modules.users.schemas import UserRead, UserUpdate
from app.modules.users.service import UserService

router = APIRouter(prefix="/users", tags=["Users"])


def _get_service(db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(UserRepository(db))


@router.get("/me", response_model=UserRead)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
):
    """Get the currently authenticated user's profile."""
    return current_user


@router.patch("/me", response_model=UserRead)
async def update_current_user_profile(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(_get_service),
):
    """Update the currently authenticated user's profile."""
    return await service.update_user(current_user.id, data)


@router.get("/{user_id}", response_model=UserRead)
async def get_user(
    user_id: UUID,
    _current_user: User = Depends(get_current_user),
    service: UserService = Depends(_get_service),
):
    """Get a user by ID."""
    return await service.get_user(user_id)

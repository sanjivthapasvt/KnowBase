from uuid import UUID

from app.core.exceptions import ConflictException, NotFoundException
from app.core.security import hash_password
from app.modules.users.models import User
from app.modules.users.repository import UserRepository
from app.modules.users.schemas import UserCreate, UserUpdate


class UserService:
    """Business logic for user operations."""

    def __init__(self, repo: UserRepository):
        self.repo = repo

    async def create_user(self, data: UserCreate) -> User:
        """Register a new user.

        Raises:
            ConflictException: If the email is already registered.
        """
        existing = await self.repo.get_by_email(data.email)
        if existing:
            raise ConflictException("Email already registered")

        user = User(
            email=data.email,
            hashed_password=hash_password(data.password),
            full_name=data.full_name,
        )
        return await self.repo.create(user)

    async def get_user(self, user_id: UUID) -> User:
        """Get a user by ID.

        Raises:
            NotFoundException: If the user does not exist.
        """
        user = await self.repo.get_by_id(user_id)
        if not user:
            raise NotFoundException("User not found")
        return user

    async def update_user(self, user_id: UUID, data: UserUpdate) -> User:
        """Update a user's profile.

        Raises:
            NotFoundException: If the user does not exist.
        """
        user = await self.repo.get_by_id(user_id)
        if not user:
            raise NotFoundException("User not found")

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)

        return await self.repo.update(user)

    async def list_users(self, *, skip: int = 0, limit: int = 100) -> list[User]:
        """List all users with pagination."""
        return await self.repo.list_all(skip=skip, limit=limit)

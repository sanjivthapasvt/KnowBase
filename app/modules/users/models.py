from sqlmodel import Field

from app.models.base import BaseDBModel


class User(BaseDBModel, table=True):
    """
        Application user.
    """

    __tablename__ = "users"

    email: str = Field(unique=True, index=True, nullable=False, max_length=255)
    hashed_password: str = Field(nullable=False)
    full_name: str = Field(max_length=255, nullable=False)
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)

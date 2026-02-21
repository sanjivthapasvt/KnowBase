"""
Base SQLModel with common fields.

All domain models should inherit from this base to get consistent
id, created_at, and updated_at fields.
"""

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class BaseDBModel(SQLModel):
    """Base model with common fields.

    Attributes:
        id: UUID primary key, auto generated.
        created_at: Timestamp of creation (UTC).
        updated_at: Timestamp of last update (UTC), auto updated.
    """

    id: UUID = Field(default_factory=uuid4, primary_key=True, nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        nullable=False,
        sa_column_kwargs={"onupdate": lambda: datetime.now(UTC)},
    )

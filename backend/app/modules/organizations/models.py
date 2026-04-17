from sqlmodel import Field

from app.models.base import BaseDBModel


class Organization(BaseDBModel, table=True):
    """Tenant organization.
    All tenant-scoped data is linked to an organization via organization_id.
    """

    __tablename__ = "organizations"

    name: str = Field(max_length=255, nullable=False)
    slug: str = Field(unique=True, index=True, max_length=100, nullable=False)
    description: str | None = Field(default=None, max_length=1000)
    is_active: bool = Field(default=True)

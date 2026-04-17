from uuid import UUID

from sqlmodel import Field

from app.models.base import BaseDBModel


class Workspace(BaseDBModel, table=True):
    """A workspace within an organization.

    Workspaces are used to group related documents (e.g. "Engineering",
    "HR Policies", "Product Specs").

    Attributes:
        name: Workspace display name.
        slug: URL-friendly unique identifier within the org.
        description: Optional description.
        organization_id: FK to the parent organization (tenant scope).
    """

    __tablename__ = "workspaces"

    name: str = Field(max_length=255, nullable=False)
    slug: str = Field(max_length=100, nullable=False, index=True)
    description: str | None = Field(default=None, max_length=1000)
    organization_id: UUID = Field(foreign_key="organizations.id", nullable=False, index=True)

import enum
from uuid import UUID

from sqlmodel import Column, Enum, Field

from app.models.base import BaseDBModel


class RoleEnum(enum.StrEnum):
    """Available roles within an organization."""

    owner = "owner"
    admin = "admin"
    member = "member"
    viewer = "viewer"


class Membership(BaseDBModel, table=True):
    """Links a user to an organization with a specific role.

    This is the core of the RBAC system: every user's access within
    an organization is determined by their membership role.

    Attributes:
        user_id: FK to users.
        organization_id: FK to organizations.
        role: The user's role within the organization.
    """

    __tablename__ = "memberships"

    user_id: UUID = Field(foreign_key="users.id", nullable=False, index=True)
    organization_id: UUID = Field(
        foreign_key="organizations.id", nullable=False, index=True
    )
    role: RoleEnum = Field(
        sa_column=Column(Enum(RoleEnum), nullable=False, default=RoleEnum.member)
    )

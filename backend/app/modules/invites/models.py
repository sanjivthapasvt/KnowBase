import enum
from uuid import UUID

from sqlmodel import Column, Enum, Field

from app.models.base import BaseDBModel


class InviteStatus(enum.StrEnum):
    """Invite lifecycle status."""

    pending = "pending"
    accepted = "accepted"
    expired = "expired"
    revoked = "revoked"


class Invite(BaseDBModel, table=True):
    """Invitation to join an organization.

    Invites are sent to an email address with a unique token.
    The recipient can accept the invite to become a member.

    Attributes:
        email: Invitee's email address.
        token: Unique invite token for acceptance.
        role: Role assigned upon acceptance.
        status: Current invite status.
        organization_id: FK to the target organization.
        invited_by: FK to the user who sent the invitation.
    """

    __tablename__ = "invites"

    email: str = Field(max_length=255, nullable=False, index=True)
    token: str = Field(unique=True, nullable=False, index=True, max_length=255)
    role: str = Field(default="member", max_length=20)
    status: InviteStatus = Field(
        sa_column=Column(Enum(InviteStatus), nullable=False, default=InviteStatus.pending)
    )
    organization_id: UUID = Field(foreign_key="organizations.id", nullable=False, index=True)
    invited_by: UUID = Field(foreign_key="users.id", nullable=False)

import secrets
from uuid import UUID

from fastapi_pagination.cursor import CursorParams
from fastapi_pagination.ext.sqlalchemy import paginate

from app.core.exceptions import BadRequestException, ConflictException, NotFoundException
from app.modules.invites.models import Invite, InviteStatus
from app.modules.invites.repository import InviteRepository
from app.modules.invites.schemas import InviteCreate
from app.modules.memberships.models import Membership, RoleEnum
from app.modules.memberships.repository import MembershipRepository
from app.modules.users.repository import UserRepository


class InviteService:
    """Business logic for invitation operations."""

    def __init__(
        self,
        invite_repo: InviteRepository,
        user_repo: UserRepository,
        membership_repo: MembershipRepository,
        db,
    ):
        self.invite_repo = invite_repo
        self.user_repo = user_repo
        self.membership_repo = membership_repo
        self.db = db

    async def create_invite(self, org_id: UUID, inviter_id: UUID, data: InviteCreate) -> Invite:
        """Create an invitation to join an organization.

        Generates a unique token for the invite link.

        Raises:
            ConflictException: If a pending invite already exists for this email.
        """
        existing = await self.invite_repo.get_pending_by_email_and_org(data.email, org_id)
        if existing:
            raise ConflictException("A pending invite already exists for this email")

        invite = Invite(
            email=data.email,
            token=secrets.token_urlsafe(32),
            role=data.role,
            status=InviteStatus.pending,
            organization_id=org_id,
            invited_by=inviter_id,
        )
        return await self.invite_repo.create(invite)

    async def accept_invite(self, token: str, user_id: UUID) -> Membership:
        """Accept an invitation and create a membership.

        Raises:
            NotFoundException: If the invite token is invalid.
            BadRequestException: If the invite is not pending.
        """
        invite = await self.invite_repo.get_by_token(token)
        if not invite:
            raise NotFoundException("Invalid invite token")

        if invite.status != InviteStatus.pending:
            raise BadRequestException(f"Invite is already {invite.status.value}")

        # Check if user is already a member
        existing_membership = await self.membership_repo.get_by_user_and_org(
            user_id, invite.organization_id
        )
        if existing_membership:
            invite.status = InviteStatus.accepted
            await self.invite_repo.update(invite)
            raise ConflictException("You are already a member of this organization")

        # Create membership
        role = RoleEnum(invite.role) if invite.role in RoleEnum.__members__ else RoleEnum.member
        membership = Membership(
            user_id=user_id,
            organization_id=invite.organization_id,
            role=role,
        )
        membership = await self.membership_repo.create(membership)

        # Mark invite as accepted
        invite.status = InviteStatus.accepted
        await self.invite_repo.update(invite)

        return membership

    async def revoke_invite(self, invite_id: UUID, org_id: UUID) -> Invite:
        """Revoke a pending invite.

        Raises:
            NotFoundException: If the invite does not exist.
            BadRequestException: If the invite is not pending.
        """
        invite = await self.invite_repo.get_by_id(invite_id)
        if not invite or invite.organization_id != org_id:
            raise NotFoundException("Invite not found")

        if invite.status != InviteStatus.pending:
            raise BadRequestException(f"Cannot revoke an invite that is {invite.status.value}")

        invite.status = InviteStatus.revoked
        return await self.invite_repo.update(invite)

    async def list_invites(self, org_id: UUID, params: CursorParams):
        """List all invites for an organization (cursor-paginated)."""
        query = self.invite_repo.get_org_invites_query(org_id)
        return await paginate(self.db, query, params)

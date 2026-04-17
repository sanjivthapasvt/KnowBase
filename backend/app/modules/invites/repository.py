from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.invites.models import Invite, InviteStatus


class InviteRepository:
    """Handles all database operations for invites."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, invite_id: UUID) -> Invite | None:
        """Fetch an invite by ID."""
        result = await self.db.execute(select(Invite).where(Invite.id == invite_id))
        return result.scalar_one_or_none()

    async def get_by_token(self, token: str) -> Invite | None:
        """Fetch an invite by its unique token."""
        result = await self.db.execute(select(Invite).where(Invite.token == token))
        return result.scalar_one_or_none()

    async def get_pending_by_email_and_org(self, email: str, org_id: UUID) -> Invite | None:
        """Check if a pending invite already exists for this email in the org."""
        result = await self.db.execute(
            select(Invite).where(
                Invite.email == email,
                Invite.organization_id == org_id,
                Invite.status == InviteStatus.pending,
            )
        )
        return result.scalar_one_or_none()

    async def list_by_org(self, org_id: UUID, *, skip: int = 0, limit: int = 100) -> list[Invite]:
        """List invites for an organization."""
        result = await self.db.execute(
            select(Invite)
            .where(Invite.organization_id == org_id)
            .order_by(Invite.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    def get_org_invites_query(self, org_id: UUID):
        """Build a query for organization invites (for pagination)."""
        return (
            select(Invite)
            .where(Invite.organization_id == org_id)
            .order_by(Invite.created_at.desc(), Invite.id.desc())
        )

    async def create(self, invite: Invite) -> Invite:
        """Persist a new invite."""
        self.db.add(invite)
        await self.db.flush()
        await self.db.refresh(invite)
        return invite

    async def update(self, invite: Invite) -> Invite:
        """Update an invite."""
        self.db.add(invite)
        await self.db.flush()
        await self.db.refresh(invite)
        return invite

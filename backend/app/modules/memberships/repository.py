from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.memberships.models import Membership


class MembershipRepository:
    """Handles all database operations for memberships."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, membership_id: UUID) -> Membership | None:
        """Fetch a membership by ID."""
        result = await self.db.execute(select(Membership).where(Membership.id == membership_id))
        return result.scalar_one_or_none()

    async def get_by_user_and_org(self, user_id: UUID, org_id: UUID) -> Membership | None:
        """Fetch a specific user's membership in an organization."""
        result = await self.db.execute(
            select(Membership).where(
                Membership.user_id == user_id,
                Membership.organization_id == org_id,
            )
        )
        return result.scalar_one_or_none()

    async def list_by_org(self, org_id: UUID) -> list[Membership]:
        """List all memberships for an organization."""
        result = await self.db.execute(
            select(Membership).where(Membership.organization_id == org_id)
        )
        return list(result.scalars().all())

    def get_org_members_query(self, org_id: UUID):
        """Build a query for organization members (for pagination)."""
        return (
            select(Membership)
            .where(Membership.organization_id == org_id)
            .order_by(Membership.created_at.desc(), Membership.id.desc())
        )

    async def create(self, membership: Membership) -> Membership:
        """Persist a new membership."""
        self.db.add(membership)
        await self.db.flush()
        await self.db.refresh(membership)
        return membership

    async def update(self, membership: Membership) -> Membership:
        """Update an existing membership."""
        self.db.add(membership)
        await self.db.flush()
        await self.db.refresh(membership)
        return membership

    async def delete(self, membership: Membership) -> None:
        """Remove a membership."""
        await self.db.delete(membership)
        await self.db.flush()

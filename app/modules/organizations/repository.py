from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.organizations.models import Organization


class OrganizationRepository:
    """Handles all database operations for organizations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, org_id: UUID) -> Organization | None:
        """Fetch an organization by ID."""
        result = await self.db.execute(select(Organization).where(Organization.id == org_id))
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Organization | None:
        """Fetch an organization by slug."""
        result = await self.db.execute(select(Organization).where(Organization.slug == slug))
        return result.scalar_one_or_none()

    async def get_slugs_starting_with(self, base_slug: str) -> list[str]:
        """Return all existing slugs that start with the given base slug."""
        result = await self.db.execute(
            select(Organization.slug).where(Organization.slug.like(f"{base_slug}%"))
        )
        return list(result.scalars().all())

    async def create(self, org: Organization) -> Organization:
        """Persist a new organization."""
        self.db.add(org)
        await self.db.flush()
        await self.db.refresh(org)
        return org

    async def update(self, org: Organization) -> Organization:
        """Update an existing organization."""
        self.db.add(org)
        await self.db.flush()
        await self.db.refresh(org)
        return org

    async def list_for_user(self, user_id: UUID) -> list[Organization]:
        """List organizations that a user belongs to."""
        from app.modules.memberships.models import Membership

        result = await self.db.execute(
            select(Organization)
            .join(Membership, Membership.organization_id == Organization.id)
            .where(Membership.user_id == user_id)
        )
        return list(result.scalars().all())

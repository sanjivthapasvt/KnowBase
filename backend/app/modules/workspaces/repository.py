from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.workspaces.models import Workspace


class WorkspaceRepository:
    """Handles all database operations for workspaces."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, workspace_id: UUID, org_id: UUID) -> Workspace | None:
        """Fetch a workspace by ID, scoped to an organization."""
        result = await self.db.execute(
            select(Workspace).where(
                Workspace.id == workspace_id,
                Workspace.organization_id == org_id,
            )
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str, org_id: UUID) -> Workspace | None:
        """Fetch a workspace by slug within an organization."""
        result = await self.db.execute(
            select(Workspace).where(
                Workspace.slug == slug,
                Workspace.organization_id == org_id,
            )
        )
        return result.scalar_one_or_none()

    async def get_slugs_starting_with(self, base_slug: str, org_id: UUID) -> list[str]:
        """Return all existing slugs starting with the base slug within an org."""
        result = await self.db.execute(
            select(Workspace.slug).where(
                Workspace.slug.like(f"{base_slug}%"),
                Workspace.organization_id == org_id,
            )
        )
        return list(result.scalars().all())

    async def list_by_org(
        self, org_id: UUID, *, skip: int = 0, limit: int = 100
    ) -> list[Workspace]:
        """List all workspaces for an organization."""
        result = await self.db.execute(
            select(Workspace)
            .where(Workspace.organization_id == org_id)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    def get_org_workspaces_query(self, org_id: UUID):
        """Build a query for organization workspaces (for pagination)."""
        return (
            select(Workspace)
            .where(Workspace.organization_id == org_id)
            .order_by(Workspace.created_at.desc(), Workspace.id.desc())
        )

    async def create(self, workspace: Workspace) -> Workspace:
        """Persist a new workspace."""
        self.db.add(workspace)
        await self.db.flush()
        await self.db.refresh(workspace)
        return workspace

    async def update(self, workspace: Workspace) -> Workspace:
        """Update an existing workspace."""
        self.db.add(workspace)
        await self.db.flush()
        await self.db.refresh(workspace)
        return workspace

    async def delete(self, workspace: Workspace) -> None:
        """Delete a workspace."""
        await self.db.delete(workspace)
        await self.db.flush()

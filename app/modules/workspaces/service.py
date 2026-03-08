from uuid import UUID

from slugify import slugify

from app.core.exceptions import NotFoundException
from app.modules.workspaces.models import Workspace
from app.modules.workspaces.repository import WorkspaceRepository
from app.modules.workspaces.schemas import WorkspaceCreate, WorkspaceUpdate


class WorkspaceService:
    """Business logic for workspace operations."""

    def __init__(self, repo: WorkspaceRepository):
        self.repo = repo

    async def _generate_unique_slug(self, name: str, org_id: UUID) -> str:
        """Generate a unique slug within the organization.

        If the base slug already exists in the org, appends -1, -2, …
        until a unique slug is found.
        """
        base_slug = slugify(name)
        existing_slugs = set(await self.repo.get_slugs_starting_with(base_slug, org_id))

        if base_slug not in existing_slugs:
            return base_slug

        counter = 1
        while f"{base_slug}-{counter}" in existing_slugs:
            counter += 1
        return f"{base_slug}-{counter}"

    async def create_workspace(self, org_id: UUID, data: WorkspaceCreate) -> Workspace:
        """Create a new workspace within an organization."""
        slug = await self._generate_unique_slug(data.name, org_id)

        workspace = Workspace(
            **data.model_dump(),
            slug=slug,
            organization_id=org_id,
        )
        return await self.repo.create(workspace)

    async def get_workspace(self, workspace_id: UUID, org_id: UUID) -> Workspace:
        """Get a workspace by ID.

        Raises:
            NotFoundException: If the workspace does not exist.
        """
        workspace = await self.repo.get_by_id(workspace_id, org_id)
        if not workspace:
            raise NotFoundException("Workspace not found")
        return workspace

    async def update_workspace(
        self, workspace_id: UUID, org_id: UUID, data: WorkspaceUpdate
    ) -> Workspace:
        """Update a workspace.

        Raises:
            NotFoundException: If the workspace does not exist.
        """
        workspace = await self.repo.get_by_id(workspace_id, org_id)
        if not workspace:
            raise NotFoundException("Workspace not found")

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(workspace, field, value)

        return await self.repo.update(workspace)

    async def delete_workspace(self, workspace_id: UUID, org_id: UUID) -> None:
        """Delete a workspace.

        Raises:
            NotFoundException: If the workspace does not exist.
        """
        workspace = await self.repo.get_by_id(workspace_id, org_id)
        if not workspace:
            raise NotFoundException("Workspace not found")
        await self.repo.delete(workspace)

    async def list_workspaces(
        self, org_id: UUID, *, skip: int = 0, limit: int = 100
    ) -> list[Workspace]:
        """List all workspaces in an organization."""
        return await self.repo.list_by_org(org_id, skip=skip, limit=limit)

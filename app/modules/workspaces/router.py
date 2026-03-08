from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies import get_current_org_id, require_role
from app.modules.memberships.models import RoleEnum
from app.modules.workspaces.repository import WorkspaceRepository
from app.modules.workspaces.schemas import (WorkspaceCreate, WorkspaceRead,
                                            WorkspaceUpdate)
from app.modules.workspaces.service import WorkspaceService

router = APIRouter(
    prefix="/organizations/{org_id}/workspaces",
    tags=["Workspaces"],
)


def _get_service(db: AsyncSession = Depends(get_db)) -> WorkspaceService:
    return WorkspaceService(WorkspaceRepository(db))


@router.get("", response_model=list[WorkspaceRead])
async def list_workspaces(
    org_id: UUID = Depends(get_current_org_id),
    service: WorkspaceService = Depends(_get_service),
):
    """List all workspaces in the organization."""
    return await service.list_workspaces(org_id)


@router.post("", response_model=WorkspaceRead, status_code=201)
async def create_workspace(
    data: WorkspaceCreate,
    org_id: UUID = Depends(get_current_org_id),
    _role: None = Depends(
        require_role(RoleEnum.owner, RoleEnum.admin, RoleEnum.member)
    ),
    service: WorkspaceService = Depends(_get_service),
):
    """Create a new workspace (owner/admin/member)."""
    return await service.create_workspace(org_id, data)


@router.get("/{workspace_id}", response_model=WorkspaceRead)
async def get_workspace(
    workspace_id: UUID,
    org_id: UUID = Depends(get_current_org_id),
    service: WorkspaceService = Depends(_get_service),
):
    """Get workspace details."""
    return await service.get_workspace(workspace_id, org_id)


@router.patch("/{workspace_id}", response_model=WorkspaceRead)
async def update_workspace(
    workspace_id: UUID,
    data: WorkspaceUpdate,
    org_id: UUID = Depends(get_current_org_id),
    _role: None = Depends(require_role(RoleEnum.owner, RoleEnum.admin)),
    service: WorkspaceService = Depends(_get_service),
):
    """Update a workspace (owner/admin only)."""
    return await service.update_workspace(workspace_id, org_id, data)


@router.delete("/{workspace_id}", status_code=204)
async def delete_workspace(
    workspace_id: UUID,
    org_id: UUID = Depends(get_current_org_id),
    _role: None = Depends(require_role(RoleEnum.owner, RoleEnum.admin)),
    service: WorkspaceService = Depends(_get_service),
):
    """Delete a workspace (owner/admin only)."""
    await service.delete_workspace(workspace_id, org_id)

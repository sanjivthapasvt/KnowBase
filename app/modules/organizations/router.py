from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies import get_current_user, require_role
from app.modules.memberships.models import RoleEnum
from app.modules.organizations.repository import OrganizationRepository
from app.modules.organizations.schemas import (
    OrganizationCreate,
    OrganizationRead,
    OrganizationUpdate,
)
from app.modules.organizations.service import OrganizationService
from app.modules.users.models import User

router = APIRouter(prefix="/organizations", tags=["Organizations"])


def _get_service(db: AsyncSession = Depends(get_db)) -> OrganizationService:
    return OrganizationService(OrganizationRepository(db), db)


@router.post("", response_model=OrganizationRead, status_code=201)
async def create_organization(
    data: OrganizationCreate,
    current_user: User = Depends(get_current_user),
    service: OrganizationService = Depends(_get_service),
):
    """Create a new organization. The creator becomes the owner."""
    return await service.create_organization(data, current_user)


@router.get("", response_model=list[OrganizationRead])
async def list_my_organizations(
    current_user: User = Depends(get_current_user),
    service: OrganizationService = Depends(_get_service),
):
    """List all organizations the current user belongs to."""
    return await service.list_user_organizations(current_user.id)


@router.get("/{org_id}", response_model=OrganizationRead)
async def get_organization(
    org_id: UUID,
    _current_user: User = Depends(get_current_user),
    service: OrganizationService = Depends(_get_service),
):
    """Get organization details."""
    return await service.get_organization(org_id)


@router.patch("/{org_id}", response_model=OrganizationRead)
async def update_organization(
    org_id: UUID,
    data: OrganizationUpdate,
    _role: None = Depends(require_role(RoleEnum.owner, RoleEnum.admin)),
    service: OrganizationService = Depends(_get_service),
):
    """Update an organization (owner/admin only)."""
    return await service.update_organization(org_id, data)

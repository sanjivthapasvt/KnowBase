from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi_pagination.cursor import CursorPage, CursorParams
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies import require_role
from app.modules.memberships.models import RoleEnum
from app.modules.memberships.repository import MembershipRepository
from app.modules.memberships.schemas import MembershipCreate, MembershipRead, MembershipUpdate
from app.modules.memberships.service import MembershipService

router = APIRouter(prefix="/organizations/{org_id}/members", tags=["Memberships"])


def _get_service(db: AsyncSession = Depends(get_db)) -> MembershipService:
    return MembershipService(MembershipRepository(db), db)


@router.get("", response_model=CursorPage[MembershipRead])
async def list_members(
    org_id: UUID,
    params: CursorParams = Depends(),
    _role: None = Depends(
        require_role(RoleEnum.owner, RoleEnum.admin, RoleEnum.member)
    ),
    service: MembershipService = Depends(_get_service),
):
    """List all members of an organization."""
    return await service.list_members(org_id, params)


@router.post("", response_model=MembershipRead, status_code=201)
async def add_member(
    org_id: UUID,
    data: MembershipCreate,
    _role: None = Depends(require_role(RoleEnum.owner, RoleEnum.admin)),
    service: MembershipService = Depends(_get_service),
):
    """Add a member to the organization (owner/admin only)."""
    return await service.add_member(org_id, data)


@router.patch("/{membership_id}", response_model=MembershipRead)
async def update_member_role(
    org_id: UUID,
    membership_id: UUID,
    data: MembershipUpdate,
    _role: None = Depends(require_role(RoleEnum.owner)),
    service: MembershipService = Depends(_get_service),
):
    """Update a member's role (owner only)."""
    return await service.update_role(org_id, membership_id, data)


@router.delete("/{membership_id}", status_code=204)
async def remove_member(
    org_id: UUID,
    membership_id: UUID,
    _role: None = Depends(require_role(RoleEnum.owner)),
    service: MembershipService = Depends(_get_service),
):
    """Remove a member from the organization (owner only)."""
    await service.remove_member(org_id, membership_id)

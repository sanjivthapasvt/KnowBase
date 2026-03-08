from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies import get_current_org_id, get_current_user, require_role
from app.modules.invites.repository import InviteRepository
from app.modules.invites.schemas import InviteAccept, InviteCreate, InviteRead
from app.modules.invites.service import InviteService
from app.modules.memberships.models import RoleEnum
from app.modules.memberships.repository import MembershipRepository
from app.modules.memberships.schemas import MembershipRead
from app.modules.users.models import User
from app.modules.users.repository import UserRepository

router = APIRouter(tags=["Invites"])


def _get_service(db: AsyncSession = Depends(get_db)) -> InviteService:
    return InviteService(
        InviteRepository(db),
        UserRepository(db),
        MembershipRepository(db),
    )


@router.get(
    "/organizations/{org_id}/invites",
    response_model=list[InviteRead],
)
async def list_invites(
    org_id: UUID = Depends(get_current_org_id),
    _role: None = Depends(require_role(RoleEnum.owner, RoleEnum.admin)),
    service: InviteService = Depends(_get_service),
):
    """List all invites for the organization (owner/admin only)."""
    return await service.list_invites(org_id)


@router.post(
    "/organizations/{org_id}/invites",
    response_model=InviteRead,
    status_code=201,
)
async def create_invite(
    data: InviteCreate,
    org_id: UUID = Depends(get_current_org_id),
    current_user: User = Depends(get_current_user),
    _role: None = Depends(require_role(RoleEnum.owner, RoleEnum.admin)),
    service: InviteService = Depends(_get_service),
):
    """Send an invitation to join the organization (owner/admin only)."""
    return await service.create_invite(org_id, current_user.id, data)


@router.delete(
    "/organizations/{org_id}/invites/{invite_id}",
    response_model=InviteRead,
)
async def revoke_invite(
    invite_id: UUID,
    org_id: UUID = Depends(get_current_org_id),
    _role: None = Depends(require_role(RoleEnum.owner, RoleEnum.admin)),
    service: InviteService = Depends(_get_service),
):
    """Revoke a pending invite (owner/admin only)."""
    return await service.revoke_invite(invite_id, org_id)


@router.post("/invites/accept", response_model=MembershipRead)
async def accept_invite(
    data: InviteAccept,
    current_user: User = Depends(get_current_user),
    service: InviteService = Depends(_get_service),
):
    """Accept an invitation using the invite token."""
    return await service.accept_invite(data.token, current_user.id)

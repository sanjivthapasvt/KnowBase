from uuid import UUID

from fastapi import APIRouter, Depends, Query
from fastapi_pagination.cursor import CursorPage, CursorParams
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies import get_current_org_id, require_role
from app.modules.audit_logs.repository import AuditLogRepository
from app.modules.audit_logs.schemas import AuditLogRead
from app.modules.audit_logs.service import AuditLogService
from app.modules.memberships.models import RoleEnum

router = APIRouter(
    prefix="/organizations/{org_id}/audit-logs",
    tags=["Audit Logs"],
)


def _get_service(db: AsyncSession = Depends(get_db)) -> AuditLogService:
    return AuditLogService(AuditLogRepository(db), db)


@router.get("", response_model=CursorPage[AuditLogRead])
async def list_audit_logs(
    params: CursorParams = Depends(),
    org_id: UUID = Depends(get_current_org_id),
    action: str | None = Query(None, description="Filter by action"),
    resource_type: str | None = Query(None, description="Filter by resource type"),
    _role: None = Depends(require_role(RoleEnum.owner, RoleEnum.admin)),
    service: AuditLogService = Depends(_get_service),
):
    """List audit logs for the organization (owner/admin only)."""
    return await service.list_logs(
        org_id, params, action=action, resource_type=resource_type
    )

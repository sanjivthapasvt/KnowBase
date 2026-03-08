from uuid import UUID

from fastapi import APIRouter, Depends, Query
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
    return AuditLogService(AuditLogRepository(db))


@router.get("", response_model=list[AuditLogRead])
async def list_audit_logs(
    org_id: UUID = Depends(get_current_org_id),
    action: str | None = Query(None, description="Filter by action"),
    resource_type: str | None = Query(None, description="Filter by resource type"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    _role: None = Depends(require_role(RoleEnum.owner, RoleEnum.admin)),
    service: AuditLogService = Depends(_get_service),
):
    """List audit logs for the organization (owner/admin only)."""
    return await service.list_logs(
        org_id, skip=skip, limit=limit, action=action, resource_type=resource_type
    )

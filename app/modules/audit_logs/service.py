from uuid import UUID

from fastapi_pagination.cursor import CursorParams
from fastapi_pagination.ext.sqlalchemy import paginate

from app.modules.audit_logs.models import AuditLog
from app.modules.audit_logs.repository import AuditLogRepository
from app.modules.audit_logs.schemas import AuditLogCreate


class AuditLogService:
    """Business logic for audit log operations.

    Audit logs are append-only — they cannot be updated or deleted.
    """

    def __init__(self, repo: AuditLogRepository, db):
        self.repo = repo
        self.db = db

    async def log_action(
        self, org_id: UUID, user_id: UUID, data: AuditLogCreate
    ) -> AuditLog:
        """Record an audit log entry."""
        log = AuditLog(
            action=data.action,
            resource_type=data.resource_type,
            resource_id=data.resource_id,
            user_id=user_id,
            organization_id=org_id,
            details=data.details,
            ip_address=data.ip_address,
        )
        return await self.repo.create(log)

    async def list_logs(
        self,
        org_id: UUID,
        params: CursorParams,
        *,
        action: str | None = None,
        resource_type: str | None = None,
    ):
        """List audit logs for an organization with optional filters (cursor-paginated)."""
        query = self.repo.get_org_logs_query(
            org_id, action=action, resource_type=resource_type
        )
        return await paginate(self.db, query, params)

    async def get_resource_history(
        self, resource_type: str, resource_id: UUID, org_id: UUID
    ) -> list[AuditLog]:
        """Get the full audit history for a specific resource."""
        return await self.repo.list_by_resource(resource_type, resource_id, org_id)

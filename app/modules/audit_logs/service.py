from uuid import UUID

from app.modules.audit_logs.models import AuditLog
from app.modules.audit_logs.repository import AuditLogRepository
from app.modules.audit_logs.schemas import AuditLogCreate


class AuditLogService:
    """Business logic for audit log operations.

    Audit logs are append-only — they cannot be updated or deleted.
    """

    def __init__(self, repo: AuditLogRepository):
        self.repo = repo

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
        *,
        skip: int = 0,
        limit: int = 100,
        action: str | None = None,
        resource_type: str | None = None,
    ) -> list[AuditLog]:
        """List audit logs for an organization with optional filters."""
        return await self.repo.list_by_org(
            org_id, skip=skip, limit=limit, action=action, resource_type=resource_type
        )

    async def get_resource_history(
        self, resource_type: str, resource_id: UUID, org_id: UUID
    ) -> list[AuditLog]:
        """Get the full audit history for a specific resource."""
        return await self.repo.list_by_resource(resource_type, resource_id, org_id)

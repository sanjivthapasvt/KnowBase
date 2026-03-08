from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.audit_logs.models import AuditLog


class AuditLogRepository:
    """Handles all database operations for audit logs."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, log: AuditLog) -> AuditLog:
        """Persist a new audit log entry."""
        self.db.add(log)
        await self.db.flush()
        await self.db.refresh(log)
        return log

    async def list_by_org(
        self,
        org_id: UUID,
        *,
        skip: int = 0,
        limit: int = 100,
        action: str | None = None,
        resource_type: str | None = None,
    ) -> list[AuditLog]:
        """List audit logs for an organization with optional filters."""
        query = select(AuditLog).where(AuditLog.organization_id == org_id)

        if action:
            query = query.where(AuditLog.action == action)
        if resource_type:
            query = query.where(AuditLog.resource_type == resource_type)

        query = query.order_by(AuditLog.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def list_by_resource(
        self, resource_type: str, resource_id: UUID, org_id: UUID
    ) -> list[AuditLog]:
        """List all audit logs for a specific resource."""
        result = await self.db.execute(
            select(AuditLog)
            .where(
                AuditLog.resource_type == resource_type,
                AuditLog.resource_id == resource_id,
                AuditLog.organization_id == org_id,
            )
            .order_by(AuditLog.created_at.desc())
        )
        return list(result.scalars().all())

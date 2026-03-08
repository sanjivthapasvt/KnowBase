from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class AuditLogCreate(BaseModel):
    """Schema for creating an audit log entry (internal use)."""

    action: str
    resource_type: str
    resource_id: UUID
    details: str | None = None
    ip_address: str | None = None


class AuditLogRead(BaseModel):
    """Schema for audit log responses."""

    id: UUID
    action: str
    resource_type: str
    resource_id: UUID
    user_id: UUID
    organization_id: UUID
    details: str | None
    ip_address: str | None
    created_at: datetime

    model_config = {"from_attributes": True}

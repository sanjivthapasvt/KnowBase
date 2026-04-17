from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, StringConstraints


class AuditLogCreate(BaseModel):
    """Schema for creating an audit log entry (internal use)."""

    action: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]
    resource_type: Annotated[
        str, StringConstraints(strip_whitespace=True, min_length=1, max_length=50)
    ]
    resource_id: UUID
    details: str | None = None
    ip_address: Annotated[str, StringConstraints(max_length=45)] | None = None


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

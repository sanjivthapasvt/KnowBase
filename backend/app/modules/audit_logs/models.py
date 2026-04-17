from uuid import UUID

from sqlmodel import Column, Field, Text

from app.models.base import BaseDBModel


class AuditLog(BaseDBModel, table=True):
    """Immutable audit trail entry.

    Records who did what, when, and where within the system.

    Attributes:
        action: Action performed (e.g. "document.created", "member.removed").
        resource_type: Type of resource affected (e.g. "document", "workspace").
        resource_id: ID of the affected resource.
        user_id: FK to the user who performed the action.
        organization_id: FK to the organization (tenant scope).
        details: Optional JSON string with additional context.
        ip_address: Optional IP address of the request.
    """

    __tablename__ = "audit_logs"

    action: str = Field(max_length=100, nullable=False, index=True)
    resource_type: str = Field(max_length=50, nullable=False, index=True)
    resource_id: UUID = Field(nullable=False)
    user_id: UUID = Field(foreign_key="users.id", nullable=False, index=True)
    organization_id: UUID = Field(foreign_key="organizations.id", nullable=False, index=True)
    details: str | None = Field(default=None, sa_column=Column(Text))
    ip_address: str | None = Field(default=None, max_length=45)

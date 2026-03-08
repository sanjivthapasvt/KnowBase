import enum
from uuid import UUID

from sqlmodel import Column, Enum, Field

from app.models.base import BaseDBModel


class DocumentStatus(enum.StrEnum):
    """Document lifecycle status."""

    draft = "draft"
    published = "published"
    archived = "archived"


class Document(BaseDBModel, table=True):
    """A knowledge base document.

    Documents live inside a workspace and are scoped to an organization.

    Attributes:
        title: Document title.
        status: Lifecycle status (draft → published → archived).
        current_version_id: FK to the latest document version.
        workspace_id: FK to the parent workspace.
        organization_id: FK to the parent organization.
        created_by: FK to the user who created the document.
    """

    __tablename__ = "documents"

    title: str = Field(max_length=500, nullable=False)
    status: DocumentStatus = Field(
        sa_column=Column(
            Enum(DocumentStatus), nullable=False, default=DocumentStatus.draft
        )
    )
    current_version_id: UUID | None = Field(
        default=None, foreign_key="document_versions.id", nullable=True
    )
    workspace_id: UUID = Field(foreign_key="workspaces.id", nullable=False, index=True)
    organization_id: UUID = Field(
        foreign_key="organizations.id", nullable=False, index=True
    )
    created_by: UUID = Field(foreign_key="users.id", nullable=False)

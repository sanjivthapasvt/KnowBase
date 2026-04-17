from uuid import UUID

from sqlmodel import Column, Field, Text

from app.models.base import BaseDBModel


class DocumentVersion(BaseDBModel, table=True):
    """Immutable snapshot of a document at a point in time.

    Every time a document is updated, a version record is created to
    maintain a full audit trail of changes.

    Attributes:
        document_id: FK to the parent document.
        version_number: Sequential version number.
        title: Title at this version.
        content: Content at this version.
        created_by: FK to the user who created this version.
        organization_id: FK to the org (denormalized for query efficiency).
    """

    __tablename__ = "document_versions"

    document_id: UUID = Field(foreign_key="documents.id", nullable=False, index=True)
    version_number: int = Field(nullable=False)
    title: str = Field(max_length=500, nullable=False)
    content: str = Field(default="", sa_column=Column(Text))
    created_by: UUID = Field(foreign_key="users.id", nullable=False)
    organization_id: UUID = Field(foreign_key="organizations.id", nullable=False, index=True)

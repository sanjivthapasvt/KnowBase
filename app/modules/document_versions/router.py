from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi_pagination.cursor import CursorPage, CursorParams
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies import get_current_org_id, get_current_user
from app.modules.document_versions.repository import DocumentVersionRepository
from app.modules.document_versions.schemas import DocumentVersionCreate, DocumentVersionRead
from app.modules.document_versions.service import DocumentVersionService
from app.modules.documents.repository import DocumentRepository
from app.modules.users.models import User

router = APIRouter(
    prefix="/organizations/{org_id}/documents/{document_id}/versions",
    tags=["Document Versions"],
)


def _get_service(db: AsyncSession = Depends(get_db)) -> DocumentVersionService:
    return DocumentVersionService(
        DocumentVersionRepository(db), DocumentRepository(db), db
    )


@router.get("", response_model=CursorPage[DocumentVersionRead])
async def list_versions(
    document_id: UUID,
    params: CursorParams = Depends(),
    org_id: UUID = Depends(get_current_org_id),
    service: DocumentVersionService = Depends(_get_service),
):
    """List all versions of a document."""
    return await service.list_versions(document_id, org_id, params)


@router.post("", response_model=DocumentVersionRead, status_code=201)
async def create_version(
    document_id: UUID,
    data: DocumentVersionCreate,
    org_id: UUID = Depends(get_current_org_id),
    current_user: User = Depends(get_current_user),
    service: DocumentVersionService = Depends(_get_service),
):
    """Create a version snapshot of the current document state."""
    return await service.create_version(document_id, org_id, current_user.id, data)


@router.get("/{version_id}", response_model=DocumentVersionRead)
async def get_version(
    version_id: UUID,
    org_id: UUID = Depends(get_current_org_id),
    service: DocumentVersionService = Depends(_get_service),
):
    """Get a specific document version."""
    return await service.get_version(version_id, org_id)

from uuid import UUID

from fastapi import APIRouter, Depends, Query
from fastapi_pagination.cursor import CursorPage, CursorParams
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies import get_current_org_id, get_current_user, require_role
from app.modules.documents.repository import DocumentRepository
from app.modules.documents.schemas import DocumentCreate, DocumentRead, DocumentUpdate
from app.modules.documents.service import DocumentService
from app.modules.memberships.models import RoleEnum
from app.modules.users.models import User

router = APIRouter(
    prefix="/organizations/{org_id}/documents",
    tags=["Documents"],
)


def _get_service(db: AsyncSession = Depends(get_db)) -> DocumentService:
    return DocumentService(DocumentRepository(db), db)


@router.get("", response_model=CursorPage[DocumentRead])
async def list_documents(
    params: CursorParams = Depends(),
    org_id: UUID = Depends(get_current_org_id),
    workspace_id: UUID | None = Query(None, description="Filter by workspace"),
    service: DocumentService = Depends(_get_service),
):
    """List documents in the organization, optionally filtered by workspace."""
    return await service.list_documents(org_id, workspace_id, params=params)


@router.post("", response_model=DocumentRead, status_code=201)
async def create_document(
    data: DocumentCreate,
    org_id: UUID = Depends(get_current_org_id),
    current_user: User = Depends(get_current_user),
    _role: None = Depends(
        require_role(RoleEnum.owner, RoleEnum.admin, RoleEnum.member)
    ),
    service: DocumentService = Depends(_get_service),
):
    """Create a new document (owner/admin/member)."""
    return await service.create_document(org_id, current_user.id, data)


@router.get("/{document_id}", response_model=DocumentRead)
async def get_document(
    document_id: UUID,
    org_id: UUID = Depends(get_current_org_id),
    service: DocumentService = Depends(_get_service),
):
    """Get document details."""
    return await service.get_document(document_id, org_id)


@router.patch("/{document_id}", response_model=DocumentRead)
async def update_document(
    document_id: UUID,
    data: DocumentUpdate,
    org_id: UUID = Depends(get_current_org_id),
    _role: None = Depends(
        require_role(RoleEnum.owner, RoleEnum.admin, RoleEnum.member)
    ),
    service: DocumentService = Depends(_get_service),
):
    """Update a document (owner/admin/member)."""
    return await service.update_document(document_id, org_id, data)


@router.delete("/{document_id}", status_code=204)
async def delete_document(
    document_id: UUID,
    org_id: UUID = Depends(get_current_org_id),
    _role: None = Depends(require_role(RoleEnum.owner, RoleEnum.admin)),
    service: DocumentService = Depends(_get_service),
):
    """Delete a document (owner/admin only)."""
    await service.delete_document(document_id, org_id)

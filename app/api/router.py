from fastapi import APIRouter

from app.modules.audit_logs.router import router as audit_logs_router
from app.modules.auth.router import router as auth_router
from app.modules.document_versions.router import \
    router as document_versions_router
from app.modules.documents.router import router as documents_router
from app.modules.invites.router import router as invites_router
from app.modules.memberships.router import router as memberships_router
from app.modules.organizations.router import router as organizations_router
from app.modules.users.router import router as users_router
from app.modules.workspaces.router import router as workspaces_router

api_router = APIRouter()

# Public routes
api_router.include_router(auth_router)

# Authenticated routes
api_router.include_router(users_router)
api_router.include_router(organizations_router)
api_router.include_router(memberships_router)
api_router.include_router(workspaces_router)
api_router.include_router(documents_router)
api_router.include_router(document_versions_router)
api_router.include_router(audit_logs_router)
api_router.include_router(invites_router)

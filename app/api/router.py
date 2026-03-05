from fastapi import APIRouter

from app.modules.auth.router import router as auth_router
from app.modules.memberships.router import router as memberships_router
from app.modules.organizations.router import router as organizations_router
from app.modules.users.router import router as users_router

api_router = APIRouter()

# Public routes
api_router.include_router(auth_router)

# Authenticated routes
api_router.include_router(users_router)
api_router.include_router(organizations_router)
api_router.include_router(memberships_router)

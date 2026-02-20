"""
FastAPI application entry point.

Creates and configures the FastAPI app instance with all routers,
middleware, exception handlers, and lifecycle events.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI

# from app.api.router import api_router
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import setup_logging
from app.core.redis import close_redis, init_redis
from app.middleware import register_middleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — startup and shutdown events."""
    # Startup
    setup_logging()
    await init_redis()
    yield
    # Shutdown
    await close_redis()


def create_app() -> FastAPI:
    """Application factory.
    """
    app = FastAPI(
        title=settings.APP_NAME,
        description="Multi-tenant Team Knowledge Base SaaS API",
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # Register middleware (CORS, request logging)
    register_middleware(app)

    # Register custom exception handlers
    register_exception_handlers(app)

    # Mount API routes under /api/v1
    # app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    # Health check (outside versioned API)
    @app.get("/health", tags=["Health"])
    async def health_check():
        """Health check endpoint."""
        return {"status": "healthy", "app": settings.APP_NAME}

    return app


# Module-level app instance for uvicorn
app = create_app()

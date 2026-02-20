"""
Custom exceptions and FastAPI exception handlers.
"""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

# ── Exception Classes ────────────────────────────────────


class AppException(Exception):
    """Base application exception."""

    def __init__(self, detail: str, status_code: int = 500):
        self.detail = detail
        self.status_code = status_code
        super().__init__(detail)


class NotFoundException(AppException):
    """Resource not found (404)."""

    def __init__(self, detail: str = "Resource not found"):
        super().__init__(detail=detail, status_code=404)


class BadRequestException(AppException):
    """Bad request (400)."""

    def __init__(self, detail: str = "Bad request"):
        super().__init__(detail=detail, status_code=400)


class UnauthorizedException(AppException):
    """Unauthorized access (401)."""

    def __init__(self, detail: str = "Not authenticated"):
        super().__init__(detail=detail, status_code=401)


class ForbiddenException(AppException):
    """Forbidden access (403)."""

    def __init__(self, detail: str = "Not enough permissions"):
        super().__init__(detail=detail, status_code=403)


class ConflictException(AppException):
    """Resource conflict (409)."""

    def __init__(self, detail: str = "Resource already exists"):
        super().__init__(detail=detail, status_code=409)


# ── Exception Handlers ───────────────────────────────────


def register_exception_handlers(app: FastAPI) -> None:
    """Register custom exception handlers with the FastAPI app."""

    @app.exception_handler(AppException)
    async def app_exception_handler(_request: Request, exc: AppException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(_request: Request, _exc: Exception) -> JSONResponse:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"},
        )

"""
Application middleware.

Request logging and CORS configuration.
"""

import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class RequestLoggingMiddleware:
    """Middleware that logs every HTTP request"""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        request = Request(scope)
        start_time = time.perf_counter()

        async def send_wrapper(message):
            if message["type"] == "http.response.start":
                duration_ms = (time.perf_counter() - start_time) * 1000
                status_code = message["status"]
                logger.info(
                    "%s %s → %d (%.1fms)",
                    request.method,
                    request.url.path,
                    status_code,
                    duration_ms,
                )
            await send(message)

        await self.app(scope, receive, send_wrapper)


def register_middleware(app: FastAPI) -> None:
    """Register all middleware with the FastAPI application."""
    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Request logging
    app.add_middleware(RequestLoggingMiddleware)

"""
Structured logging configuration.

Sets up JSON-formatted logging for production and human-readable for development.
"""

import logging
import sys

from app.core.config import settings


def setup_logging() -> None:
    """Configure application logging.

    - In production: JSON-formatted, INFO level.
    - In development: Human-readable, DEBUG level.
    """
    log_level = logging.DEBUG if settings.DEBUG else logging.INFO
    log_format = (
        "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
        if settings.DEBUG
        else '{"time":"%(asctime)s","level":"%(levelname)s","logger":"%(name)s","msg":"%(message)s"}'
    )

    logging.basicConfig(
        level=log_level,
        format=log_format,
        handlers=[logging.StreamHandler(sys.stdout)],
        force=True,
    )

    # Quiet noisy third-party loggers
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """Get a named logger instance.

    Usage::

        from app.core.logging import get_logger
        logger = get_logger(__name__)
        logger.info("Something happened")
    """
    return logging.getLogger(name)

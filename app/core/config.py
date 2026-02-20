"""
Application configuration.

"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # ── Application ──────────────────────────────────────
    APP_NAME: str = "KnowBase"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # ── Database ─────────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://knowbase:knowbase@localhost:5432/knowbase"

    # ── Redis ────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── JWT / Security ───────────────────────────────────
    SECRET_KEY: str = "change-me-to-a-random-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── CORS ─────────────────────────────────────────────
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"


settings = Settings()

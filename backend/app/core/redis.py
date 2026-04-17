"""
Redis connection management.
"""

from redis.asyncio import Redis, from_url

from app.core.config import settings

redis_client: Redis | None = None


async def init_redis() -> Redis:
    """Initialize the global Redis connection pool."""
    global redis_client
    redis_client = from_url(
        settings.REDIS_URL,
        encoding="utf-8",
        decode_responses=True,
    )
    return redis_client


async def close_redis() -> None:
    """Close the Redis connection pool."""
    global redis_client
    if redis_client:
        await redis_client.close()
        redis_client = None


def get_redis() -> Redis:
    """Dependency to get the Redis client.

    Usage::

        @router.get("/cached")
        async def cached_endpoint(redis: Redis = Depends(get_redis)):
            ...
    """
    if redis_client is None:
        raise RuntimeError("Redis is not initialized. Call init_redis() first.")
    return redis_client

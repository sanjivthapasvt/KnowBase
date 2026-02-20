# ── Stage 1: Build ───────────────────────────────────────
FROM python:3.11-slim AS builder

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /build

# Copy dependency files first for better layer caching
COPY pyproject.toml uv.lock ./

# Install dependencies only (not the project itself) for caching
ENV UV_PROJECT_ENVIRONMENT=/opt/venv
RUN uv sync --frozen --no-dev --no-install-project

# Copy application source and install the project
COPY . .
RUN uv sync --frozen --no-dev

# ── Stage 2: Runtime ─────────────────────────────────────
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# Copy the virtual environment from builder (to /opt/venv, outside /app)
COPY --from=builder /opt/venv /opt/venv

# Copy application code
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
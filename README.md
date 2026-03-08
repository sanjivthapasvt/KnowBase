# KnowBase

> Multi-tenant Team Knowledge Base SaaS

A centralized platform where teams can create, organize, and share internal documentation, processes, guides, and institutional knowledge.

---

## 🚀 Quick Start

```bash
# 1. Clone and configure
cp .env.example .env

# 2. Start with Docker
docker compose up -d

# 3. API is available at
open http://localhost:8000/docs
```

### Local Development (without Docker)

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -e ".[dev]"

# Run the server
uvicorn app.main:app --reload

# Run migrations
alembic upgrade head

# Run tests
pytest tests/ -v
```

---

## 📂 Project Structure

```
KnowBase/
├── .env.example              # Environment variables template
├── Dockerfile                # Multi-stage Docker build
├── docker-compose.yml        # API + PostgreSQL + Redis
├── pyproject.toml            # Dependencies + ruff + pytest config
├── alembic.ini               # Alembic config
│
├── alembic/                  # Database migrations
│   ├── env.py                # Async migration environment
│   ├── script.py.mako        # Migration template
│   └── versions/             # Migration files
│
├── app/
│   ├── main.py               # FastAPI app factory + lifespan
│   ├── dependencies.py       # Shared deps (auth, tenant, RBAC)
│   ├── middleware.py          # Request logging, CORS
│   │
│   ├── api/
│   │   └── router.py         # Aggregates all module routers
│   │
│   ├── core/                 # Infrastructure
│   │   ├── config.py         # Pydantic Settings
│   │   ├── database.py       # Async SQLAlchemy engine + sessions
│   │   ├── redis.py          # Redis connection pool
│   │   ├── security.py       # JWT + password hashing
│   │   ├── logging.py        # Structured logging
│   │   └── exceptions.py     # Custom exceptions + handlers
│   │
│   ├── models/
│   │   └── base.py           # BaseDBModel (id, created_at, updated_at)
│   │
│   └── modules/              # Domain modules
│       ├── auth/             # JWT auth (register, login, refresh)
│       ├── users/            # User profiles
│       ├── organizations/    # Tenant organizations
│       ├── memberships/      # RBAC (user ↔ org roles)
│       ├── workspaces/       # Workspaces within orgs
│       ├── documents/        # Knowledge base documents
│       ├── document_versions/# Version history
│       ├── audit_logs/       # Immutable audit trail
│       └── invites/          # Org invitations
│
└── tests/
    ├── conftest.py           # Async fixtures
    ├── test_health.py        # Health check test
    └── test_auth.py          # Auth flow tests
```

Each module follows the same internal structure:
```
modules/{name}/
├── __init__.py
├── models.py       # SQLModel ORM models
├── schemas.py      # Pydantic request/response schemas
├── repository.py   # Data access layer (DB queries)
├── service.py      # Business logic layer
├── router.py       # FastAPI router (API endpoints)
└── dependencies.py # Module-specific dependencies (if needed)
```

---

## 🏛️ Architecture

### Layered Architecture

```
Request → Router → Service → Repository → Database
                      ↓
                   Schemas (Pydantic)
```

| Layer | Responsibility |
|-------|---------------|
| **Router** | HTTP endpoints, request parsing, response serialization |
| **Service** | Business logic, validation rules, orchestration |
| **Repository** | Database queries, data persistence |
| **Models** | ORM definitions (SQLModel) |
| **Schemas** | Input/output validation (Pydantic v2) |

### How Modules Interact

Modules communicate through their **service layer**, never directly through repositories or models of another module. For example:

- `OrganizationService` imports `Membership` model to create the owner membership on org creation.
- `InviteService` accepts dependencies for `UserRepository` and `MembershipRepository` to handle invite acceptance.
- `dependencies.py` (shared) imports `User` and `Membership` models for auth and RBAC checks.

This keeps boundaries clear — each module owns its data, and cross-module interactions happen through injected dependencies at the service layer.

---

## 🔐 Auth System

JWT-based authentication with access + refresh token flow:

| Token | Lifetime | Purpose |
|-------|----------|---------|
| Access Token | 30 minutes | API authentication |
| Refresh Token | 7 days | Issue new access tokens |

**Endpoints:**
- `POST /api/v1/auth/register` — Create account, get tokens
- `POST /api/v1/auth/login` — Login with email/password
- `POST /api/v1/auth/refresh` — Refresh expired access token

**Auth Dependency:**
```python
from app.dependencies import get_current_user

@router.get("/protected")
async def protected_endpoint(user: User = Depends(get_current_user)):
    # user is authenticated
    ...
```

---

## 🏢 Multi-Tenancy

Organization-scoped architecture. All tenant data includes an `organization_id` column.

**How it works:**

1. User authenticates → JWT contains `user_id`
2. Request includes `org_id` in the URL path (e.g., `/api/v1/organizations/{org_id}/documents`)
3. `get_current_org_id` dependency verifies the user is a member of that org
4. All queries are scoped to `organization_id`

```python
from app.dependencies import get_current_org_id

@router.get("/organizations/{org_id}/documents")
async def list_docs(org_id: UUID = Depends(get_current_org_id)):
    # org_id is validated — user is a member
    ...
```

---

## 🧾 RBAC (Role-Based Access Control)

Roles are stored in the `memberships` table (join between `users` and `organizations`):

| Role | Permissions |
|------|------------|
| **owner** | Full access, manage members, delete org |
| **admin** | Manage content, invite members, update org |
| **member** | Create/edit documents, create workspaces |
| **viewer** | Read-only access |

**Usage:**
```python
from app.dependencies import require_role
from app.modules.memberships.models import RoleEnum

@router.delete("/{doc_id}")
async def delete_doc(
    _role: None = Depends(require_role(RoleEnum.owner, RoleEnum.admin)),
):
    # Only owner and admin can reach here
    ...
```

---

## ➕ How to Add a New Module

1. **Create the module directory:**
   ```
   app/modules/your_module/
   ├── __init__.py
   ├── models.py
   ├── schemas.py
   ├── repository.py
   ├── service.py
   └── router.py
   ```

2. **Define the model** in `models.py` (inherit from `BaseDBModel`)

3. **Create schemas** in `schemas.py` (Pydantic `BaseModel`)

4. **Build the repository** in `repository.py` (accept `AsyncSession`)

5. **Write business logic** in `service.py` (accept repository)

6. **Create the router** in `router.py` with endpoints

7. **Register the router** in `app/api/router.py`:
   ```python
   from app.modules.your_module.router import router as your_module_router
   api_router.include_router(your_module_router)
   ```

8. **Import the model** in `alembic/env.py` for migration autogeneration

9. **Generate migration:**
   ```bash
   alembic revision --autogenerate -m "add your_module table"
   alembic upgrade head
   ```

---

## ⚙️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **FastAPI** | Web framework |
| **PostgreSQL** | Primary database |
| **SQLModel** | ORM (SQLAlchemy + Pydantic) |
| **Alembic** | Database migrations |
| **Redis** | Caching / background jobs readiness |
| **Pydantic v2** | Validation & serialization |
| **python-jose** | JWT tokens |
| **passlib** | Password hashing (bcrypt) |
| **Docker** | Containerization |
| **pytest** | Testing |
| **Ruff** | Linting & formatting |

---

## 🐳 Docker

```bash
# Start all services
docker compose up -d

# Rebuild after code changes
docker compose up --build

# View logs
docker compose logs -f api

# Stop all services
docker compose down
```

Services:
- **api** → `localhost:8000` (FastAPI with hot-reload)
- **postgres** → `localhost:5432` (PostgreSQL 16)
- **redis** → `localhost:6379` (Redis 7)

---

## 🧪 Testing

```bash
# Run all tests
pytest tests/ -v

# Run specific test file
pytest tests/test_auth.py -v

# Run with coverage (install pytest-cov first)
pytest tests/ --cov=app --cov-report=term-missing
```

---

## 📋 API Endpoints Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/v1/auth/register` | Register | ✗ |
| `POST` | `/api/v1/auth/login` | Login | ✗ |
| `POST` | `/api/v1/auth/refresh` | Refresh token | ✗ |
| `GET` | `/api/v1/users/me` | Current user profile | ✓ |
| `PATCH` | `/api/v1/users/me` | Update profile | ✓ |
| `POST` | `/api/v1/organizations` | Create org | ✓ |
| `GET` | `/api/v1/organizations` | List my orgs | ✓ |
| `GET` | `/api/v1/organizations/{org_id}/members` | List members | ✓ (member+) |
| `POST` | `/api/v1/organizations/{org_id}/members` | Add member | ✓ (admin+) |
| `GET` | `/api/v1/organizations/{org_id}/workspaces` | List workspaces | ✓ |
| `POST` | `/api/v1/organizations/{org_id}/workspaces` | Create workspace | ✓ (member+) |
| `GET` | `/api/v1/organizations/{org_id}/documents` | List documents | ✓ |
| `POST` | `/api/v1/organizations/{org_id}/documents` | Create document | ✓ (member+) |
| `GET` | `/api/v1/organizations/{org_id}/documents/{id}/versions` | List versions | ✓ |
| `GET` | `/api/v1/organizations/{org_id}/audit-logs` | Audit logs | ✓ (admin+) |
| `POST` | `/api/v1/organizations/{org_id}/invites` | Send invite | ✓ (admin+) |
| `POST` | `/api/v1/invites/accept` | Accept invite | ✓ |
| `GET` | `/health` | Health check | ✗ |

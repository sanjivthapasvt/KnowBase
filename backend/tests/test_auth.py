"""
Authentication endpoint tests.
"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_success(client: AsyncClient):
    """Test successful user registration."""
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "StrongPass123!",
            "full_name": "New User",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient, test_user):
    """Test that registering with an existing email returns 409."""
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "password": "AnotherPass1!",
            "full_name": "Duplicate User",
        },
    )
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, test_user):
    """Test successful login with valid credentials."""
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "test@example.com",
            "password": "testpassword123",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


@pytest.mark.asyncio
async def test_login_invalid_credentials(client: AsyncClient, test_user):
    """Test that invalid credentials return 401."""
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "test@example.com",
            "password": "wrongpassword",
        },
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_current_user_authenticated(client: AsyncClient, test_user, auth_headers):
    """Test that authenticated users can access their profile."""
    response = await client.get("/api/v1/users/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Test User"


@pytest.mark.asyncio
async def test_get_current_user_unauthenticated(client: AsyncClient):
    """Test that unauthenticated requests to protected endpoints return 401."""
    response = await client.get("/api/v1/users/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_refresh_token(client: AsyncClient):
    """Test refreshing an access token."""
    # First register to get tokens
    register_response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "refresh@example.com",
            "password": "RefreshPass1!",
            "full_name": "Refresh User",
        },
    )
    refresh_token = register_response.json()["refresh_token"]

    # Use refresh token
    response = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


# ── Validation Tests ─────────────────────────────────────


@pytest.mark.asyncio
async def test_register_short_password(client: AsyncClient):
    """Test that a password shorter than 8 characters is rejected."""
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "short@example.com",
            "password": "Ab1!",
            "full_name": "Short Pass",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_register_password_missing_uppercase(client: AsyncClient):
    """Test that a password without uppercase is rejected."""
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "noup@example.com",
            "password": "weakpass123!",
            "full_name": "No Upper",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_register_password_missing_digit(client: AsyncClient):
    """Test that a password without a digit is rejected."""
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "nodigit@example.com",
            "password": "WeakPassword!",
            "full_name": "No Digit",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_register_password_missing_special(client: AsyncClient):
    """Test that a password without a special character is rejected."""
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "nospec@example.com",
            "password": "WeakPass123",
            "full_name": "No Special",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_register_empty_full_name(client: AsyncClient):
    """Test that an empty full_name is rejected."""
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "empty@example.com",
            "password": "StrongPass1!",
            "full_name": "",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_register_whitespace_only_full_name(client: AsyncClient):
    """Test that a whitespace-only full_name is rejected."""
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "space@example.com",
            "password": "StrongPass1!",
            "full_name": "   ",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_register_invalid_email(client: AsyncClient):
    """Test that an invalid email format is rejected."""
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "not-an-email",
            "password": "StrongPass1!",
            "full_name": "Bad Email",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_empty_password(client: AsyncClient):
    """Test that an empty password on login is rejected."""
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "test@example.com",
            "password": "",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_refresh_empty_token(client: AsyncClient):
    """Test that an empty refresh token is rejected."""
    response = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": ""},
    )
    assert response.status_code == 422

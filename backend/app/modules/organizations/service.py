from uuid import UUID

from fastapi_pagination.cursor import CursorParams
from fastapi_pagination.ext.sqlalchemy import paginate
from slugify import slugify

from app.core.exceptions import NotFoundException
from app.modules.memberships.models import Membership, RoleEnum
from app.modules.organizations.models import Organization
from app.modules.organizations.repository import OrganizationRepository
from app.modules.organizations.schemas import OrganizationCreate, OrganizationUpdate
from app.modules.users.models import User


class OrganizationService:
    """Business logic for organization operations."""

    def __init__(self, repo: OrganizationRepository, db):
        self.repo = repo
        self.db = db

    async def _generate_unique_slug(self, name: str) -> str:
        """Generate a unique slug from the given name.

        If the base slug already exists, appends -1, -2, … until a unique
        slug is found.
        """
        base_slug = slugify(name)
        existing_slugs = set(await self.repo.get_slugs_starting_with(base_slug))

        if base_slug not in existing_slugs:
            return base_slug

        counter = 1
        while f"{base_slug}-{counter}" in existing_slugs:
            counter += 1
        return f"{base_slug}-{counter}"

    async def create_organization(self, data: OrganizationCreate, creator: User) -> Organization:
        """Create a new organization and assign the creator as owner."""
        slug = await self._generate_unique_slug(data.name)

        org = Organization(**data.model_dump(), slug=slug)
        org = await self.repo.create(org)

        # Add creator as owner
        membership = Membership(
            user_id=creator.id,
            organization_id=org.id,
            role=RoleEnum.owner,
        )
        self.db.add(membership)
        await self.db.flush()

        return org

    async def get_organization(self, org_id: UUID) -> Organization:
        """Get an organization by ID.

        Raises:
            NotFoundException: If the organization does not exist.
        """
        org = await self.repo.get_by_id(org_id)
        if not org:
            raise NotFoundException("Organization not found")
        return org

    async def update_organization(self, org_id: UUID, data: OrganizationUpdate) -> Organization:
        """Update an organization.

        Raises:
            NotFoundException: If the organization does not exist.
        """
        org = await self.repo.get_by_id(org_id)
        if not org:
            raise NotFoundException("Organization not found")

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(org, field, value)

        return await self.repo.update(org)

    async def list_user_organizations(self, user_id: UUID, params: CursorParams):
        """List all organizations a user belongs to (cursor-paginated)."""
        query = self.repo.get_user_organizations_query(user_id)
        return await paginate(self.db, query, params)

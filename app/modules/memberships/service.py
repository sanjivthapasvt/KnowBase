from uuid import UUID

from app.core.exceptions import (ConflictException, ForbiddenException,
                                 NotFoundException)
from app.modules.memberships.models import Membership, RoleEnum
from app.modules.memberships.repository import MembershipRepository
from app.modules.memberships.schemas import MembershipCreate, MembershipUpdate


class MembershipService:
    """Business logic for membership / RBAC operations."""

    def __init__(self, repo: MembershipRepository):
        self.repo = repo

    async def add_member(self, org_id: UUID, data: MembershipCreate) -> Membership:
        """Add a user to an organization with a role.

        Raises:
            ConflictException: If the user is already a member.
        """
        existing = await self.repo.get_by_user_and_org(data.user_id, org_id)
        if existing:
            raise ConflictException("User is already a member of this organization")

        membership = Membership(
            user_id=data.user_id,
            organization_id=org_id,
            role=data.role,
        )
        return await self.repo.create(membership)

    async def update_role(
        self, org_id: UUID, membership_id: UUID, data: MembershipUpdate
    ) -> Membership:
        """Update a member's role.

        Raises:
            NotFoundException: If the membership does not exist.
            ForbiddenException: If trying to change the last owner's role.
        """
        membership = await self.repo.get_by_id(membership_id)
        if not membership or membership.organization_id != org_id:
            raise NotFoundException("Membership not found")

        # Prevent removing the last owner
        if membership.role == RoleEnum.owner and data.role != RoleEnum.owner:
            org_members = await self.repo.list_by_org(org_id)
            owner_count = sum(1 for m in org_members if m.role == RoleEnum.owner)
            if owner_count <= 1:
                raise ForbiddenException("Cannot change role of the last owner")

        membership.role = data.role
        return await self.repo.update(membership)

    async def remove_member(self, org_id: UUID, membership_id: UUID) -> None:
        """Remove a member from an organization.

        Raises:
            NotFoundException: If the membership does not exist.
            ForbiddenException: If trying to remove the last owner.
        """
        membership = await self.repo.get_by_id(membership_id)
        if not membership or membership.organization_id != org_id:
            raise NotFoundException("Membership not found")

        if membership.role == RoleEnum.owner:
            org_members = await self.repo.list_by_org(org_id)
            owner_count = sum(1 for m in org_members if m.role == RoleEnum.owner)
            if owner_count <= 1:
                raise ForbiddenException("Cannot remove the last owner")

        await self.repo.delete(membership)

    async def list_members(self, org_id: UUID) -> list[Membership]:
        """List all members of an organization."""
        return await self.repo.list_by_org(org_id)

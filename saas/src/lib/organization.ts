import { prisma } from "./prisma";
import { OrganizationUserRole } from "@prisma/client";
import { OrganizationWithUsers, UserWithOrganizations } from "@/types/organization";

/**
 * Get an organization by ID with its users
 */
export async function getOrganizationById(id: string): Promise<OrganizationWithUsers | null> {
  return prisma.organization.findUnique({
    where: { id },
    include: {
      users: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Get an organization by slug with its users
 */
export async function getOrganizationBySlug(slug: string): Promise<OrganizationWithUsers | null> {
  return prisma.organization.findUnique({
    where: { slug },
    include: {
      users: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Get all organizations for a user
 */
export async function getUserOrganizations(userId: string): Promise<UserWithOrganizations | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      defaultOrganizationId: true,
      organizations: {
        include: {
          organization: true,
        },
      },
    },
  });

  return user;
}

/**
 * Check if a user has access to an organization
 */
export async function hasOrganizationAccess(userId: string, organizationId: string): Promise<boolean> {
  const organizationUser = await prisma.organizationUser.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });

  return !!organizationUser;
}

/**
 * Check if a user has a specific role in an organization
 */
export async function hasOrganizationRole(
  userId: string,
  organizationId: string,
  roles: OrganizationUserRole[]
): Promise<boolean> {
  const organizationUser = await prisma.organizationUser.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });

  if (!organizationUser) {
    return false;
  }

  return roles.includes(organizationUser.role);
}

/**
 * Create a new organization
 */
export async function createOrganization(
  name: string,
  slug: string,
  creatorId: string,
  description?: string,
  logo?: string
) {
  return prisma.$transaction(async (tx) => {
    // Create the organization
    const organization = await tx.organization.create({
      data: {
        name,
        slug,
        description,
        logo,
        createdById: creatorId,
      },
    });

    // Add the creator as an owner
    await tx.organizationUser.create({
      data: {
        organizationId: organization.id,
        userId: creatorId,
        role: OrganizationUserRole.OWNER,
        invitationAccepted: true,
      },
    });

    // Set as default organization for the user if they don't have one
    const user = await tx.user.findUnique({
      where: { id: creatorId },
      select: { defaultOrganizationId: true },
    });

    if (!user?.defaultOrganizationId) {
      await tx.user.update({
        where: { id: creatorId },
        data: { defaultOrganizationId: organization.id },
      });
    }

    return organization;
  });
}

/**
 * Update an organization
 */
export async function updateOrganization(
  id: string,
  data: {
    name?: string;
    description?: string;
    logo?: string;
    billingEmail?: string;
    billingName?: string;
    billingAddress?: string;
    settings?: any;
  }
) {
  return prisma.organization.update({
    where: { id },
    data,
  });
}

/**
 * Delete an organization
 */
export async function deleteOrganization(id: string) {
  return prisma.organization.delete({
    where: { id },
  });
}

/**
 * Invite a user to an organization
 */
export async function inviteUserToOrganization(
  email: string,
  organizationId: string,
  role: OrganizationUserRole = OrganizationUserRole.MEMBER
) {
  // Check if user exists
  let user = await prisma.user.findUnique({
    where: { email },
  });

  // Generate invitation token
  const invitationToken = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

  if (user) {
    // Check if user is already in the organization
    const existingMembership = await prisma.organizationUser.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: user.id,
        },
      },
    });

    if (existingMembership) {
      throw new Error("User is already a member of this organization");
    }

    // Create organization user with invitation
    return prisma.organizationUser.create({
      data: {
        organizationId,
        userId: user.id,
        role,
        invitationToken,
        invitationSentAt: new Date(),
      },
    });
  } else {
    // Create a placeholder user
    user = await prisma.user.create({
      data: {
        email,
        name: email.split("@")[0],
      },
    });

    // Create organization user with invitation
    return prisma.organizationUser.create({
      data: {
        organizationId,
        userId: user.id,
        role,
        invitationToken,
        invitationSentAt: new Date(),
      },
    });
  }
}

/**
 * Accept an invitation to an organization
 */
export async function acceptOrganizationInvitation(invitationToken: string) {
  return prisma.organizationUser.update({
    where: { invitationToken },
    data: {
      invitationAccepted: true,
      invitationToken: null,
    },
  });
}

/**
 * Update a user's role in an organization
 */
export async function updateOrganizationUserRole(
  organizationId: string,
  userId: string,
  role: OrganizationUserRole
) {
  return prisma.organizationUser.update({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
    data: { role },
  });
}

/**
 * Remove a user from an organization
 */
export async function removeUserFromOrganization(organizationId: string, userId: string) {
  return prisma.organizationUser.delete({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });
}

/**
 * Set a user's default organization
 */
export async function setDefaultOrganization(userId: string, organizationId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { defaultOrganizationId: organizationId },
  });
}

/**
 * Get all invitations for an organization
 */
export async function getOrganizationInvitations(organizationId: string) {
  const invitations = await prisma.organizationUser.findMany({
    where: {
      organizationId,
      invitationAccepted: false,
      invitationToken: {
        not: null
      }
    },
    select: {
      id: true,
      role: true,
      invitationToken: true,
      invitationSentAt: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          image: true
        }
      }
    }
  });

  // Transform the data to match the expected format in the frontend
  return invitations.map((invitation) => ({
    id: invitation.id,
    email: invitation.user.email,
    role: invitation.role,
    createdAt: invitation.createdAt.toISOString(),
    token: invitation.invitationToken || '',
  }));
}

/**
 * Cancel an invitation
 */
export async function cancelInvitation(invitationId: string) {
  return prisma.organizationUser.delete({
    where: {
      id: invitationId
    }
  });
}

/**
 * Get all users in an organization
 */
export async function getOrganizationUsers(organizationId: string) {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: {
      users: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!organization) {
    console.log(`No organization found with ID: ${organizationId}`);
    return [];
  }

  console.log(`Found organization with ${organization.users.length} users`);

  // Transform the data to match the expected format in the frontend
  const transformedUsers = organization.users.map((ou) => {
    console.log("Processing user:", ou.user.id, ou.user.email);
    return {
      id: ou.user.id,
      email: ou.user.email,
      name: ou.user.name,
      image: ou.user.image,
      role: ou.role,
      joinedAt: ou.createdAt.toISOString(),
      invitationAccepted: ou.invitationAccepted,
    };
  });

  console.log(`Transformed ${transformedUsers.length} users`);
  return transformedUsers;
} 
import { Organization, OrganizationUser, OrganizationUserRole } from "@prisma/client";

export type OrganizationType = Organization;
export type OrganizationUserType = OrganizationUser;
export type OrganizationUserRoleType = OrganizationUserRole;

export type OrganizationWithUsers = Organization & {
  users: (OrganizationUser & {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
  })[];
};

export type OrganizationUserWithOrganization = OrganizationUser & {
  organization: Organization;
};

export type UserWithOrganizations = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  organizations: OrganizationUserWithOrganization[];
  defaultOrganizationId: string | null;
}; 
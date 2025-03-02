import { User } from "next-auth"
import { JWT } from "next-auth/jwt"
import { OrganizationType, OrganizationUserRoleType } from "./organization"

type UserId = string

declare module "next-auth/jwt" {
    interface JWT {
        id: UserId
        organizationId?: string
        organizationRole?: OrganizationUserRoleType
    }
}

declare module "next-auth" {
    interface Session {
        user: User & {
            id: UserId
            organizationId?: string
            organizationRole?: OrganizationUserRoleType
            organization?: OrganizationType
        }
    }
}

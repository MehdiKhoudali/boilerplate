import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { 
  getOrganizationById, 
  inviteUserToOrganization,
  hasOrganizationRole,
  getOrganizationUsers
} from "@/src/lib/organization";
import { OrganizationUserRole } from "@prisma/client";
import { z } from "zod";

// Schema for user invitation
const InviteUserSchema = z.object({
  email: z.string().email("Invalid email"),
  role: z.nativeEnum(OrganizationUserRole).default(OrganizationUserRole.MEMBER),
});

// GET /api/organizations/[id]/users - Get all users in an organization
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`API - GET /api/organizations/${params.id}/users - Start`);
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log("API - Unauthorized request - No session user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`API - Checking access for user ${session.user.id} to organization ${params.id}`);
    // Check if user has access to this organization
    const hasAccess = await hasOrganizationRole(
      session.user.id,
      params.id,
      [OrganizationUserRole.MEMBER, OrganizationUserRole.ADMIN, OrganizationUserRole.OWNER]
    );

    if (!hasAccess) {
      console.log(`API - Forbidden - User ${session.user.id} does not have access to organization ${params.id}`);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.log(`API - Fetching users for organization ${params.id}`);
    // Get all users for this organization
    const users = await getOrganizationUsers(params.id);
    
    console.log(`API - Fetched ${users.length} organization users`);
    
    if (!Array.isArray(users)) {
      console.error("API - Users data is not an array:", users);
      return NextResponse.json({ error: "Invalid users data format" }, { status: 500 });
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error("API - Error fetching organization users:", error);
    return NextResponse.json({ error: "Failed to fetch organization users" }, { status: 500 });
  }
}

// POST /api/organizations/[id]/users - Invite a user to an organization
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`API - POST /api/organizations/${params.id}/users - Start`);
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log("API - Unauthorized request - No session user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`API - Checking permissions for user ${session.user.id} to invite to organization ${params.id}`);
    // Check if user has admin or owner role
    const hasPermission = await hasOrganizationRole(
      session.user.id,
      params.id,
      [OrganizationUserRole.ADMIN, OrganizationUserRole.OWNER]
    );

    if (!hasPermission) {
      console.log(`API - Forbidden - User ${session.user.id} does not have permission to invite to organization ${params.id}`);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    
    // Validate request body
    const validationResult = InviteUserSchema.safeParse(body);
    if (!validationResult.success) {
      console.log("API - Invalid request body:", validationResult.error.format());
      return NextResponse.json(
        { error: "Invalid request", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { email, role } = validationResult.data;
    console.log(`API - Inviting user ${email} with role ${role} to organization ${params.id}`);

    // Invite the user
    const organizationUser = await inviteUserToOrganization(
      email,
      params.id,
      role
    );

    console.log(`API - User ${email} invited successfully`);
    // TODO: Send invitation email

    return NextResponse.json(organizationUser, { status: 201 });
  } catch (error) {
    console.error("API - Error inviting user:", error);
    
    if (error instanceof Error && error.message === "User is already a member of this organization") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Failed to invite user" }, { status: 500 });
  }
} 
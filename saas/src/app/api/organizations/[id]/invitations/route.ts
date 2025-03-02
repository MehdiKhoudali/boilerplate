import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { 
  getOrganizationById, 
  hasOrganizationRole,
  getOrganizationInvitations,
  inviteUserToOrganization
} from "@/src/lib/organization";
import { OrganizationUserRole } from "@prisma/client";
import { z } from "zod";

// Schema for user invitation
const InviteUserSchema = z.object({
  email: z.string().email("Invalid email"),
  role: z.string().default("MEMBER"),
});

// GET /api/organizations/[id]/invitations - Get all invitations for an organization
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has access to this organization
    const hasAccess = await hasOrganizationRole(
      session.user.id,
      params.id,
      [OrganizationUserRole.MEMBER, OrganizationUserRole.ADMIN, OrganizationUserRole.OWNER]
    );

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all invitations for this organization
    const invitations = await getOrganizationInvitations(params.id);

    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Error fetching organization invitations:", error);
    return NextResponse.json({ error: "Failed to fetch organization invitations" }, { status: 500 });
  }
}

// POST /api/organizations/[id]/invitations - Invite a user to an organization
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin or owner role
    const hasPermission = await hasOrganizationRole(
      session.user.id,
      params.id,
      [OrganizationUserRole.ADMIN, OrganizationUserRole.OWNER]
    );

    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    
    // Validate request body
    const validationResult = InviteUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { email, role } = validationResult.data;
    
    // Convert role string to enum
    const roleEnum = role.toUpperCase() as OrganizationUserRole;

    // Invite the user
    const organizationUser = await inviteUserToOrganization(
      email,
      params.id,
      roleEnum
    );

    return NextResponse.json(organizationUser, { status: 201 });
  } catch (error) {
    console.error("Error inviting user:", error);
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Failed to invite user" }, { status: 500 });
  }
} 
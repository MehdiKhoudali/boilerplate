import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { 
  hasOrganizationRole,
  updateOrganizationUserRole,
  removeUserFromOrganization
} from "@/src/lib/organization";
import { OrganizationUserRole } from "@prisma/client";
import { z } from "zod";

// Schema for user role update
const UpdateUserRoleSchema = z.object({
  role: z.nativeEnum(OrganizationUserRole),
});

// PATCH /api/organizations/[id]/users/[userId] - Update a user's role
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; userId: string } }
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
    const validationResult = UpdateUserRoleSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { role } = validationResult.data;

    // Prevent changing role of organization owner
    const targetUserIsOwner = await hasOrganizationRole(
      params.userId,
      params.id,
      [OrganizationUserRole.OWNER]
    );

    if (targetUserIsOwner) {
      return NextResponse.json(
        { error: "Cannot change role of organization owner" },
        { status: 400 }
      );
    }

    // Update the user's role
    const organizationUser = await updateOrganizationUserRole(
      params.id,
      params.userId,
      role
    );

    return NextResponse.json(organizationUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}

// DELETE /api/organizations/[id]/users/[userId] - Remove a user from an organization
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; userId: string } }
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

    // Prevent removing organization owner
    const targetUserIsOwner = await hasOrganizationRole(
      params.userId,
      params.id,
      [OrganizationUserRole.OWNER]
    );

    if (targetUserIsOwner) {
      return NextResponse.json(
        { error: "Cannot remove organization owner" },
        { status: 400 }
      );
    }

    // Remove the user from the organization
    await removeUserFromOrganization(params.id, params.userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing user:", error);
    return NextResponse.json({ error: "Failed to remove user" }, { status: 500 });
  }
} 
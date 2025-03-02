import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { 
  getOrganizationById, 
  updateOrganization, 
  deleteOrganization,
  hasOrganizationRole
} from "@/src/lib/organization";
import { OrganizationUserRole } from "@prisma/client";
import { z } from "zod";

// Schema for organization update
const UpdateOrganizationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  billingEmail: z.string().email("Invalid email").optional(),
  billingName: z.string().optional(),
  billingAddress: z.string().optional(),
  settings: z.any().optional(),
});

// GET /api/organizations/[id] - Get an organization by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organization = await getOrganizationById(params.id);

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Check if user has access to this organization
    const hasAccess = organization.users.some(
      (ou) => ou.user.id === session.user.id
    );

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(organization);
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json({ error: "Failed to fetch organization" }, { status: 500 });
  }
}

// PATCH /api/organizations/[id] - Update an organization
export async function PATCH(
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
    const validationResult = UpdateOrganizationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Update the organization
    const organization = await updateOrganization(params.id, validationResult.data);

    return NextResponse.json(organization);
  } catch (error) {
    console.error("Error updating organization:", error);
    return NextResponse.json({ error: "Failed to update organization" }, { status: 500 });
  }
}

// DELETE /api/organizations/[id] - Delete an organization
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has owner role
    const hasPermission = await hasOrganizationRole(
      session.user.id,
      params.id,
      [OrganizationUserRole.OWNER]
    );

    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the organization
    await deleteOrganization(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting organization:", error);
    return NextResponse.json({ error: "Failed to delete organization" }, { status: 500 });
  }
} 
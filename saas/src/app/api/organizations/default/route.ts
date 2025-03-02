import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { setDefaultOrganization, hasOrganizationAccess } from "@/src/lib/organization";
import { z } from "zod";

// Schema for setting default organization
const SetDefaultOrganizationSchema = z.object({
  organizationId: z.string(),
});

// POST /api/organizations/default - Set default organization
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate request body
    const validationResult = SetDefaultOrganizationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { organizationId } = validationResult.data;

    // Check if user has access to this organization
    const hasAccess = await hasOrganizationAccess(session.user.id, organizationId);

    if (!hasAccess) {
      return NextResponse.json({ error: "You don't have access to this organization" }, { status: 403 });
    }

    // Set as default organization
    await setDefaultOrganization(session.user.id, organizationId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting default organization:", error);
    return NextResponse.json({ error: "Failed to set default organization" }, { status: 500 });
  }
} 
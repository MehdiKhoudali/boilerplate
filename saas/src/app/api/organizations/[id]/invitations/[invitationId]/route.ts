import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { 
  hasOrganizationRole,
  cancelInvitation
} from "@/src/lib/organization";
import { OrganizationUserRole } from "@prisma/client";

// DELETE /api/organizations/[id]/invitations/[invitationId] - Cancel an invitation
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; invitationId: string } }
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

    // Cancel the invitation
    await cancelInvitation(params.invitationId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling invitation:", error);
    return NextResponse.json({ error: "Failed to cancel invitation" }, { status: 500 });
  }
} 
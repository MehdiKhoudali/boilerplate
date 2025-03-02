import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { acceptOrganizationInvitation } from "@/src/lib/organization";
import { prisma } from "@/src/lib/prisma";

// POST /api/organizations/invitations/[token] - Accept an organization invitation
export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the invitation
    const invitation = await prisma.organizationUser.findUnique({
      where: { invitationToken: params.token },
      include: { organization: true },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found or already accepted" }, { status: 404 });
    }

    // Check if the invitation is for the current user
    if (invitation.userId !== session.user.id) {
      return NextResponse.json({ error: "This invitation is not for you" }, { status: 403 });
    }

    // Accept the invitation
    const organizationUser = await acceptOrganizationInvitation(params.token);

    // Set as default organization if user doesn't have one
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { defaultOrganizationId: true },
    });

    if (!user?.defaultOrganizationId) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { defaultOrganizationId: invitation.organizationId },
      });
    }

    return NextResponse.json({
      success: true,
      organization: invitation.organization,
    });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json({ error: "Failed to accept invitation" }, { status: 500 });
  }
} 
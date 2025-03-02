import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { getOrganizationBySlug } from "@/src/lib/organization";

// GET /api/organizations/slug/[slug] - Get an organization by slug
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organization = await getOrganizationBySlug(params.slug);

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    return NextResponse.json(organization);
  } catch (error) {
    console.error("Error fetching organization by slug:", error);
    return NextResponse.json({ error: "Failed to fetch organization" }, { status: 500 });
  }
} 
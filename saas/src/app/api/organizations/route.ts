import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { createOrganization, getUserOrganizations } from "@/src/lib/organization";
import { prisma } from "@/src/lib/prisma";
import { z } from "zod";

// Schema for organization creation
const CreateOrganizationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  logo: z.string().optional(),
});

// GET /api/organizations - Get all organizations for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizations = await getUserOrganizations(session.user.id);

    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 });
  }
}

// POST /api/organizations - Create a new organization
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate request body
    const validationResult = CreateOrganizationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { name, slug, description, logo } = validationResult.data;
    
    // Check if slug is already taken
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });
    
    if (existingOrg) {
      return NextResponse.json(
        { error: "Slug is already taken" },
        { status: 400 }
      );
    }

    // Create the organization
    const organization = await createOrganization(
      name,
      slug,
      session.user.id,
      description,
      logo
    );

    return NextResponse.json(organization, { status: 201 });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 });
  }
} 
-- CreateEnum
CREATE TYPE "OrganizationUserRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'GUEST');

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "markdowns" ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "defaultOrganizationId" TEXT;

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "billingEmail" TEXT,
    "billingName" TEXT,
    "billingAddress" TEXT,
    "settings" JSONB,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_users" (
    "id" TEXT NOT NULL,
    "role" "OrganizationUserRole" NOT NULL DEFAULT 'MEMBER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invitationToken" TEXT,
    "invitationAccepted" BOOLEAN NOT NULL DEFAULT false,
    "invitationSentAt" TIMESTAMP(3),
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "organization_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE INDEX "organizations_createdById_idx" ON "organizations"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "organization_users_invitationToken_key" ON "organization_users"("invitationToken");

-- CreateIndex
CREATE INDEX "organization_users_organizationId_idx" ON "organization_users"("organizationId");

-- CreateIndex
CREATE INDEX "organization_users_userId_idx" ON "organization_users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "organization_users_organizationId_userId_key" ON "organization_users"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "files_organizationId_idx" ON "files"("organizationId");

-- CreateIndex
CREATE INDEX "markdowns_organizationId_idx" ON "markdowns"("organizationId");

-- CreateIndex
CREATE INDEX "messages_organizationId_idx" ON "messages"("organizationId");

-- CreateIndex
CREATE INDEX "users_defaultOrganizationId_idx" ON "users"("defaultOrganizationId");

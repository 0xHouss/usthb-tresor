-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('CorruptedFile', 'WrongMetadata', 'Copyright', 'Other');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('Open', 'Resolved', 'Dismissed');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventType" ADD VALUE 'ReportCreated';
ALTER TYPE "EventType" ADD VALUE 'ReportResolved';
ALTER TYPE "EventType" ADD VALUE 'ReportDismissed';
ALTER TYPE "EventType" ADD VALUE 'FileDeleted';

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "details" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'Open',
    "fileId" TEXT,
    "fileMetadata" JSONB NOT NULL,
    "reporterId" TEXT NOT NULL,
    "resolvedById" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Report_status_createdAt_idx" ON "Report"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Report_fileId_idx" ON "Report"("fileId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

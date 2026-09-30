-- AlterTable
ALTER TABLE "File" ADD COLUMN     "anonymous" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PendingFile" ADD COLUMN     "anonymous" BOOLEAN NOT NULL DEFAULT false;

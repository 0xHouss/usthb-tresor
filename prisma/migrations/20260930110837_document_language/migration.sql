-- CreateEnum
CREATE TYPE "Language" AS ENUM ('French', 'English');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'French';

-- AlterTable
ALTER TABLE "PendingFile" ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'French';

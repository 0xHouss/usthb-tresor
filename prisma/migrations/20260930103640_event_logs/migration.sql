-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('UserLogin', 'FileSubmitted', 'FileApproved', 'FileRejected');

-- CreateTable
CREATE TABLE "EventLog" (
    "id" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "actorId" TEXT,
    "targetId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventLog_createdAt_idx" ON "EventLog"("createdAt");

-- CreateIndex
CREATE INDEX "EventLog_type_createdAt_idx" ON "EventLog"("type", "createdAt");

-- CreateIndex
CREATE INDEX "EventLog_actorId_idx" ON "EventLog"("actorId");

-- AddForeignKey
ALTER TABLE "EventLog" ADD CONSTRAINT "EventLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "FileDownload" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileDownload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FileDownload_fileId_idx" ON "FileDownload"("fileId");

-- CreateIndex
CREATE INDEX "FileDownload_createdAt_idx" ON "FileDownload"("createdAt");

-- AddForeignKey
ALTER TABLE "FileDownload" ADD CONSTRAINT "FileDownload_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

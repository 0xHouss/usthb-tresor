/*
  Warnings:

  - You are about to drop the column `status` on the `File` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "PendingFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "driveId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "academicLevel" TEXT NOT NULL,
    "academicYear" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "group" TEXT,
    "majorName" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "professorFullName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "uploadedByEmail" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PendingFile_uploadedByEmail_fkey" FOREIGN KEY ("uploadedByEmail") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "driveId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "academicLevel" TEXT NOT NULL,
    "academicYear" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "group" TEXT,
    "majorName" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "professorFullName" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedByEmail" TEXT NOT NULL,
    CONSTRAINT "File_majorName_fkey" FOREIGN KEY ("majorName") REFERENCES "Major" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "File_moduleName_fkey" FOREIGN KEY ("moduleName") REFERENCES "Module" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "File_professorFullName_fkey" FOREIGN KEY ("professorFullName") REFERENCES "Professor" ("fullName") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "File_uploadedByEmail_fkey" FOREIGN KEY ("uploadedByEmail") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_File" ("academicLevel", "academicYear", "driveId", "group", "id", "majorName", "moduleName", "professorFullName", "section", "semester", "type", "uploadedAt", "uploadedByEmail") SELECT "academicLevel", "academicYear", "driveId", "group", "id", "majorName", "moduleName", "professorFullName", "section", "semester", "type", "uploadedAt", "uploadedByEmail" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE UNIQUE INDEX "File_driveId_key" ON "File"("driveId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PendingFile_driveId_key" ON "PendingFile"("driveId");

/*
  Warnings:

  - You are about to alter the column `academicYear` on the `File` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "academicLevel" TEXT NOT NULL,
    "academicYear" INTEGER NOT NULL,
    "section" TEXT NOT NULL,
    "group" TEXT,
    "semester" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "professor" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'APPROVED',
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedByEmail" TEXT NOT NULL,
    CONSTRAINT "File_uploadedByEmail_fkey" FOREIGN KEY ("uploadedByEmail") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_File" ("academicLevel", "academicYear", "group", "id", "major", "module", "professor", "section", "semester", "status", "type", "uploadedAt", "uploadedByEmail", "url") SELECT "academicLevel", "academicYear", "group", "id", "major", "module", "professor", "section", "semester", "status", "type", "uploadedAt", "uploadedByEmail", "url" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

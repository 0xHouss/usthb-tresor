/*
  Warnings:

  - You are about to drop the column `schoolYear` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `speciality` on the `File` table. All the data in the column will be lost.
  - Added the required column `academicLevel` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `major` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "academicLevel" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
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
INSERT INTO "new_File" ("academicYear", "group", "id", "module", "professor", "section", "semester", "status", "type", "uploadedAt", "uploadedByEmail", "url") SELECT "academicYear", "group", "id", "module", "professor", "section", "semester", "status", "type", "uploadedAt", "uploadedByEmail", "url" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

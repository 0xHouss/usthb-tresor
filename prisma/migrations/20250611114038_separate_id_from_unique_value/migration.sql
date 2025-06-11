/*
  Warnings:

  - The primary key for the `Major` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Module` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Professor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `driveId` to the `File` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Major` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Module` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Professor` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
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
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedByEmail" TEXT NOT NULL,
    CONSTRAINT "File_majorName_fkey" FOREIGN KEY ("majorName") REFERENCES "Major" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "File_moduleName_fkey" FOREIGN KEY ("moduleName") REFERENCES "Module" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "File_professorFullName_fkey" FOREIGN KEY ("professorFullName") REFERENCES "Professor" ("fullName") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "File_uploadedByEmail_fkey" FOREIGN KEY ("uploadedByEmail") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_File" ("academicLevel", "academicYear", "group", "id", "majorName", "moduleName", "professorFullName", "section", "semester", "status", "type", "uploadedAt", "uploadedByEmail") SELECT "academicLevel", "academicYear", "group", "id", "majorName", "moduleName", "professorFullName", "section", "semester", "status", "type", "uploadedAt", "uploadedByEmail" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE UNIQUE INDEX "File_driveId_key" ON "File"("driveId");
CREATE TABLE "new_Major" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Major" ("name") SELECT "name" FROM "Major";
DROP TABLE "Major";
ALTER TABLE "new_Major" RENAME TO "Major";
CREATE UNIQUE INDEX "Major_name_key" ON "Major"("name");
CREATE TABLE "new_Module" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Module" ("name") SELECT "name" FROM "Module";
DROP TABLE "Module";
ALTER TABLE "new_Module" RENAME TO "Module";
CREATE UNIQUE INDEX "Module_name_key" ON "Module"("name");
CREATE TABLE "new_Professor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL
);
INSERT INTO "new_Professor" ("fullName") SELECT "fullName" FROM "Professor";
DROP TABLE "Professor";
ALTER TABLE "new_Professor" RENAME TO "Professor";
CREATE UNIQUE INDEX "Professor_fullName_key" ON "Professor"("fullName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

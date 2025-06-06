/*
  Warnings:

  - You are about to drop the column `major` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `module` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `professor` on the `File` table. All the data in the column will be lost.
  - Added the required column `majorName` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moduleName` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professorFullName` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Professor" (
    "fullName" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Module" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Major" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "academicLevel" TEXT NOT NULL,
    "academicYear" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "group" TEXT,
    "majorName" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "professorFullName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Approved',
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedByEmail" TEXT NOT NULL,
    CONSTRAINT "File_majorName_fkey" FOREIGN KEY ("majorName") REFERENCES "Major" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "File_moduleName_fkey" FOREIGN KEY ("moduleName") REFERENCES "Module" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "File_professorFullName_fkey" FOREIGN KEY ("professorFullName") REFERENCES "Professor" ("fullName") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "File_uploadedByEmail_fkey" FOREIGN KEY ("uploadedByEmail") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_File" ("academicLevel", "academicYear", "group", "id", "section", "semester", "status", "type", "uploadedAt", "uploadedByEmail") SELECT "academicLevel", "academicYear", "group", "id", "section", "semester", "status", "type", "uploadedAt", "uploadedByEmail" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

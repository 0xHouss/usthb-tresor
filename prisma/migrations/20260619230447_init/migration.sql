-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('User', 'Moderator', 'Admin');

-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('Lecture', 'DW_Worksheet', 'PW_Worksheet', 'Interrogation', 'Exam', 'PW_Exam');

-- CreateEnum
CREATE TYPE "AcademicLevel" AS ENUM ('L1', 'L2', 'L3', 'M1', 'M2', 'D1', 'D2', 'D3', 'ING1', 'ING2', 'ING3', 'ING4', 'ING5');

-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('S1', 'S2');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'User',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "PendingFile" (
    "id" TEXT NOT NULL,
    "driveId" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "academicLevel" "AcademicLevel" NOT NULL,
    "academicYear" INTEGER NOT NULL,
    "semester" "Semester" NOT NULL,
    "section" TEXT NOT NULL,
    "group" TEXT,
    "majorName" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "professorFullName" TEXT NOT NULL,
    "status" "FileStatus" NOT NULL DEFAULT 'Pending',
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedByEmail" TEXT NOT NULL,

    CONSTRAINT "PendingFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "driveId" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "academicLevel" "AcademicLevel" NOT NULL,
    "academicYear" INTEGER NOT NULL,
    "semester" "Semester" NOT NULL,
    "section" TEXT NOT NULL,
    "group" TEXT,
    "majorName" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "professorFullName" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedByEmail" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professor" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Major" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Major_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "PendingFile_driveId_key" ON "PendingFile"("driveId");

-- CreateIndex
CREATE UNIQUE INDEX "File_driveId_key" ON "File"("driveId");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_fullName_key" ON "Professor"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "Module_name_key" ON "Module"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Major_name_key" ON "Major"("name");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingFile" ADD CONSTRAINT "PendingFile_uploadedByEmail_fkey" FOREIGN KEY ("uploadedByEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_majorName_fkey" FOREIGN KEY ("majorName") REFERENCES "Major"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_moduleName_fkey" FOREIGN KEY ("moduleName") REFERENCES "Module"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_professorFullName_fkey" FOREIGN KEY ("professorFullName") REFERENCES "Professor"("fullName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploadedByEmail_fkey" FOREIGN KEY ("uploadedByEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

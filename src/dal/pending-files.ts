import "server-only";

import { prisma } from "@/lib/prisma";
import { requireModerator } from "@/dal/session";
import { AcademicLevel, FileStatus, FileType, Semester } from "@prisma/client";

export type NewPendingFile = {
  driveId: string;
  uploaderEmail: string;
  type: FileType;
  academicLevel: AcademicLevel;
  academicYear: number;
  semester: Semester;
  section: string;
  group?: string | null;
  majorName: string;
  moduleName: string;
  professorFullName: string;
};

/** Pending submissions awaiting review. Moderator/Admin only. */
export async function getPendingFiles() {
  await requireModerator();
  return prisma.pendingFile.findMany({ where: { status: FileStatus.Pending } });
}

export function createPendingFile(data: NewPendingFile) {
  return prisma.pendingFile.create({
    data: {
      driveId: data.driveId,
      type: data.type,
      academicLevel: data.academicLevel,
      academicYear: data.academicYear,
      semester: data.semester,
      section: data.section,
      group: data.group,
      majorName: data.majorName,
      moduleName: data.moduleName,
      professorFullName: data.professorFullName,
      uploadedBy: { connect: { email: data.uploaderEmail } },
    },
  });
}

/**
 * Promotes a pending submission to an approved `File`, creating the referenced
 * Major/Module/Professor on demand, then marks the submission Approved.
 */
export async function approvePendingFile(id: string) {
  const pendingFile = await prisma.pendingFile.findUniqueOrThrow({ where: { id } });

  await prisma.file.create({
    data: {
      driveId: pendingFile.driveId,
      type: pendingFile.type,
      academicLevel: pendingFile.academicLevel,
      academicYear: pendingFile.academicYear,
      semester: pendingFile.semester,
      section: pendingFile.section,
      group: pendingFile.group,
      major: {
        connectOrCreate: {
          where: { name: pendingFile.majorName },
          create: { name: pendingFile.majorName },
        },
      },
      module: {
        connectOrCreate: {
          where: { name: pendingFile.moduleName },
          create: { name: pendingFile.moduleName },
        },
      },
      professor: {
        connectOrCreate: {
          where: { fullName: pendingFile.professorFullName },
          create: { fullName: pendingFile.professorFullName },
        },
      },
      uploadedBy: { connect: { email: pendingFile.uploadedByEmail } },
    },
  });

  await prisma.pendingFile.update({
    where: { id },
    data: { status: FileStatus.Approved },
  });
}

export function rejectPendingFile(id: string) {
  return prisma.pendingFile.update({
    where: { id },
    data: { status: FileStatus.Rejected },
  });
}

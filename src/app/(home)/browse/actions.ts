import { prisma } from "@/lib/prisma";
import { ParsedSearchParams } from "./page";
import { FileStatus } from "@prisma/client";

export const pageSize = 12;

export async function getFiles({ academicLevels, modules, majors, professors, startYear, endYear,  semester, types, group, section }: ParsedSearchParams) {
  const files = prisma.file.findMany({
    where: {
      status: FileStatus.Approved,
      moduleName: modules?.length ? { in: modules } : undefined,
      professorFullName: professors?.length ? { in: professors } : undefined,
      academicLevel: academicLevels?.length ? { in: academicLevels } : undefined,
      semester: semester ? { equals: semester } : undefined,
      type: types?.length ? { in: types } : undefined,
      majorName: majors?.length ? { in: majors } : undefined,
      academicYear: {
        gte: startYear ? startYear : undefined,
        lte: endYear ? endYear : undefined,
      },
      section: { equals: section },
      group: { equals: group },
    },
    take: pageSize,
  });

  return files;
}

export const getMajors = async () => prisma.major.findMany();
export const getProfessors = async () => prisma.professor.findMany();
export const getModules = async () => prisma.module.findMany();

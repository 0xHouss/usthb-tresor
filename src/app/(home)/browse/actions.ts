import { prisma } from "@/lib/prisma";
import { FileStatus } from "@prisma/client";
import { ParsedSearchParams } from "./page";

export const PAGE_SIZE = 12;

export async function getFiles({ academicLevels, modules, majors, professors, startYear, endYear, semester, types, group, section, page }: ParsedSearchParams) {
  const files = await prisma.file.findMany({
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
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  const totalCount = await prisma.file.count({
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
    }
  });

  return { files, totalCount };
}

export const getMajors = async () => prisma.major.findMany();
export const getProfessors = async () => prisma.professor.findMany();
export const getModules = async () => prisma.module.findMany();

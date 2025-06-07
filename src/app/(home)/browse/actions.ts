import { prisma } from "@/lib/prisma";
import { FileStatus } from "@prisma/client";
import { ParsedSearchParams } from "./page";
import { getCurrentAcademicYear } from "@/lib/utils";

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

export async function getAcademicYearRange() {
  // Get the minimum academicYear
  const minResult = await prisma.file.aggregate({
    _min: {
      academicYear: true,
    },
  });

  // Get the maximum academicYear
  const maxResult = await prisma.file.aggregate({
    _max: {
      academicYear: true,
    },
  });

  // Extract the values, they can be null if no rows exist
  const minYear = minResult._min.academicYear || 1974;
  const maxYear = (maxResult._max.academicYear ? maxResult._max.academicYear : getCurrentAcademicYear()) + 1;

  return {
    minYear,
    maxYear,
  };
}
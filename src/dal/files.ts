import "server-only";

import { prisma } from "@/lib/prisma";
import type { ParsedSearchParams } from "@/lib/search-params";
import { getCurrentAcademicYear, PAGE_SIZE } from "@/lib/utils";
import { Prisma } from "@prisma/client";

// Approved `File` reads. All public — anyone (including visitors) may browse.

export function getRecentFiles(take = 6) {
  return prisma.file.findMany({ orderBy: { uploadedAt: "desc" }, take });
}

export async function getFileStats() {
  const [resources, majors, modules, contributors] = await Promise.all([
    prisma.file.count(),
    prisma.major.count(),
    prisma.module.count(),
    prisma.file.findMany({ distinct: ["uploadedByEmail"], select: { uploadedByEmail: true } }),
  ]);
  return { resources, majors, modules, contributors: contributors.length };
}

export type AcademicYearRange = { minYear: number; maxYear: number };

export async function getAcademicYearRange(): Promise<AcademicYearRange> {
  const [minResult, maxResult] = await Promise.all([
    prisma.file.aggregate({ _min: { academicYear: true } }),
    prisma.file.aggregate({ _max: { academicYear: true } }),
  ]);

  const minYear = minResult._min.academicYear || 1974;
  const maxYear =
    (maxResult._max.academicYear ? maxResult._max.academicYear : getCurrentAcademicYear()) + 1;

  return { minYear, maxYear };
}

export async function getFiles({
  academicLevels,
  modules,
  majors,
  professors,
  startYear,
  endYear,
  semester,
  types,
  group,
  section,
  page,
}: ParsedSearchParams) {
  const where: Prisma.FileWhereInput = {
    moduleName: modules?.length ? { in: modules } : undefined,
    professorFullName: professors?.length ? { in: professors } : undefined,
    academicLevel: academicLevels?.length ? { in: academicLevels } : undefined,
    semester: semester ? { equals: semester } : undefined,
    type: types?.length ? { in: types } : undefined,
    majorName: majors?.length ? { in: majors } : undefined,
    academicYear: {
      gte: startYear,
      lte: endYear,
    },
    section: { equals: section },
    group: { equals: group },
  };

  const [files, totalCount] = await Promise.all([
    prisma.file.findMany({
      where,
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.file.count({ where }),
  ]);

  return { files, totalCount };
}

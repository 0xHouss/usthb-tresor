import { prisma } from "@/lib/prisma";

export interface SearchParams {
  page: number;
  professor?: string;
  module?: string;
  schoolYear?: string;
  academicYear?: string;
  semester?: number;
  type?: string;
  section?: string;
  group?: string;
  speciality?: string;
  search?: string;
}

export const pageSize = 10;

export async function getFiles({ page, academicYear, module, speciality, professor, schoolYear, search, semester, type, group, section }: SearchParams) {
  const files = prisma.file.findMany({
    where: {
      status: "APPROVED",
      module: { equals: module },
      professor: { equals: professor },
      schoolYear: { equals: schoolYear },
      academicYear: { equals: academicYear },
      semester: { equals: semester },
      speciality: { equals: speciality },
      type: { equals: type },
      section: { equals: section },
      group: { equals: group },
      OR: [
        { module: { contains: search } },
        { professor: { contains: search } },
        { type: { contains: search } },
        { schoolYear: { contains: search } },
        { academicYear: { contains: search } },
        { speciality: { contains: search } },
        { section: { contains: search } },
        { group: { contains: search } },
      ],
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return files;
}


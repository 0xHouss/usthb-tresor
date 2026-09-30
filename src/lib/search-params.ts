import { isEnumValue } from "@/lib/utils";
import { AcademicLevel, FileType, Language, Semester } from "@prisma/client";

export type SearchParams = Promise<{
  semester?: string;
  majors?: string;
  section?: string;
  group?: string;
  startYear?: string;
  endYear?: string;
  academicLevels?: string;
  professors?: string;
  types?: string;
  modules?: string;
  languages?: string;
  page?: string
} & URLSearchParams>

// Parses a query-string value to an int, returning undefined when absent or not a number.
const toInt = (value: string | undefined) => {
  const n = value ? parseInt(value) : NaN;
  return isNaN(n) ? undefined : n;
};

// Parses a 1-based page number, falling back to the first page.
export const parsePage = (value: string | undefined) => Math.max(1, toInt(value) ?? 1);

export async function parseSearchParams(params: SearchParams) {
  const { academicLevels, semester, majors, section, group, startYear, endYear, professors, modules, types, languages, page } = await params;

  const parsedParams = {
    semester: isEnumValue(Semester, semester) ? semester : undefined,
    majors: majors?.length ? majors.split(",") : undefined,
    section,
    group,
    startYear: toInt(startYear),
    endYear: toInt(endYear),
    academicLevels: academicLevels?.length ? academicLevels.split(",").filter(l => isEnumValue(AcademicLevel, l)) : undefined,
    professors: professors?.length ? professors.split(",") : undefined,
    types: types?.length ? types.split(",").filter(t => isEnumValue(FileType, t)) : undefined,
    modules: modules?.length ? modules.split(",") : undefined,
    languages: languages?.length ? languages.split(",").filter(l => isEnumValue(Language, l)) : undefined,
    page: parsePage(page),
  };

  return parsedParams;
}

export type ParsedSearchParams = Awaited<ReturnType<typeof parseSearchParams>>;

import { getAcademicYearRange, getFiles, getMajors, getModules, getProfessors } from "@/actions/file-actions";
import { FileFilterSidebar } from "@/components/file-filter-sidebar";
import NoDataIllustration from "@/components/svg/no-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fileTypeLabels, getFileDownloadUrl, getFileUrl, isEnumValue, PAGE_SIZE } from "@/lib/utils";
import { AcademicLevel, FileType, Semester } from "@prisma/client";
import { DownloadIcon } from "lucide-react";
import Link from "next/link";
import { PaginationWithLinks } from "../../../components/pagination-with-links";
import ResourceCard from "@/components/resource-card";

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
  page?: string
} & URLSearchParams>

async function parseSearchParams(params: SearchParams) {
  const { academicLevels, semester, majors, section, group, startYear, endYear, professors, modules, types, page } = await params;

  const parsedParams = {
    semester: semester ? isEnumValue(Semester, semester) ? semester : undefined : undefined,
    majors: majors?.length ? majors.split(",") : undefined,
    section,
    group,
    startYear: startYear ? parseInt(startYear) : undefined,
    endYear: endYear ? parseInt(endYear) : undefined,
    academicLevels: academicLevels?.length ? academicLevels.split(",").filter(l => isEnumValue(AcademicLevel, l)) : undefined,
    professors: professors?.length ? professors.split(",") : undefined,
    types: types?.length ? types.split(",").filter(t => isEnumValue(FileType, t)) : undefined,
    modules: modules?.length ? modules.split(",") : undefined,
    page: page && !isNaN(parseInt(page)) ? parseInt(page) : 1,
  };

  return parsedParams;
}

export type ParsedSearchParams = Awaited<ReturnType<typeof parseSearchParams>>;

export default async function BrowsePage(props: { searchParams: SearchParams }) {
  const searchParams = await parseSearchParams(props.searchParams);

  const { files, totalCount } = await getFiles(searchParams);
  const majors = await getMajors()
  const modules = await getModules();
  const professors = await getProfessors();

  const start = (searchParams.page - 1) * PAGE_SIZE + 1;
  const end = Math.min(searchParams.page * PAGE_SIZE, totalCount);

  const academicYearRange = await getAcademicYearRange();

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 p-4 md:h-[calc(100vh-calc(var(--spacing)*18))]">
      <aside className="w-full md:w-72 shrink-0 border rounded-lg overflow-hidden md:sticky md:top-4">
        <FileFilterSidebar
          searchParams={searchParams}
          majors={majors}
          modules={modules}
          professors={professors}
          academicYearRange={academicYearRange}
        />
      </aside>

      <main className="flex-1 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">Showing {start}–{end} of {totalCount} result{totalCount !== 1 ? "s" : ""}</p>

        {files.length ? (
          <>
            <ScrollArea className="flex overflow-hidden h-[100%] md:pr-4">
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {files.map((file) => (
                  <ResourceCard key={file.id} file={file} />
                ))}
              </div>
            </ScrollArea>
            <div className="flex items-center justify-center">
              <PaginationWithLinks
                page={searchParams.page}
                pageSize={PAGE_SIZE}
                totalCount={totalCount}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center gap-6 flex-1">
            <NoDataIllustration height={300} width={300} />
            <p className="text-muted-foreground text-xl mt-4">No files found...</p>
          </div>
        )}
      </main>
    </div>
  )
}

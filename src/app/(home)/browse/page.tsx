import { FileFilterSidebar } from "@/components/file-filter-sidebar";
import NoDataIllustration from "@/components/svg/no-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFileDownloadUrl, getFileUrl, isEnumValue } from "@/lib/utils";
import { AcademicLevel, FileType, Semester } from "@prisma/client";
import { DownloadIcon } from "lucide-react";
import Link from "next/link";
import { PaginationWithLinks } from "../../../components/pagination-with-links";
import { getFiles, getMajors, getModules, getProfessors, PAGE_SIZE } from "./actions";

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

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 p-4 h-[calc(100vh-calc(var(--spacing)*18))]">
      <aside className="w-full md:w-72 shrink-0 border rounded-lg overflow-hidden md:sticky md:top-4">
        <FileFilterSidebar
          searchParams={searchParams}
          majors={majors}
          modules={modules}
          professors={professors}
        />
      </aside>

      <main className="flex-1 pr-4 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">Showing {start}–{end} of {totalCount} result{totalCount !== 1 ? "s" : ""}</p>

        {files.length ? (
          <>
            <ScrollArea className="flex overflow-hidden h-[100%] pr-4">
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {files.map((file) => (
                  <Card key={file.id} className="relative">
                    <CardHeader className="flex flex-row justify-between">
                      <div className="flex items-center gap-4">
                        <Link href={getFileDownloadUrl(file.id)} className="rounded-md bg-muted p-6 cursor-pointer" >
                          <DownloadIcon className="w-5 h-5" />
                        </Link>
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-xs font-normal">{file.academicYear}/{file.academicYear + 1}</p>
                          <CardTitle className="truncate hover:underline text-lg/[1em]">
                            <Link href={getFileUrl(file.id)} target="_blank">
                              {file.type} - {file.moduleName}
                            </Link>
                          </CardTitle>
                          <div className="flex flex-wrap gap-1">
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                              {file.academicLevel}
                            </span>
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                              S-{file.section}
                            </span>
                            {file.group && (
                              <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                                G-{file.group}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-semibold">Details:</h3>
                      <div className="text-sm">
                        <p>Major: <span className="text-muted-foreground">{file.majorName}</span></p>
                        <p>Professor: <span className="text-muted-foreground">{file.professorFullName}</span></p>
                      </div>
                    </CardContent>
                  </Card>
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

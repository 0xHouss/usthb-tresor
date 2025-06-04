import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Eye } from "lucide-react";
import Link from "next/link";
import { getFiles } from "./actions";
import SearchBar from "./search-bar";

type Params = Promise<{ slug: string }>

export type SearchParams = Promise<{
  search?: string;
  professor?: string;
  module?: string;
  schoolYear?: string;
  academicYear?: string;
  semester?: string;
  section?: string;
  group?: string;
  speciality?: string;
  type?: string;
  page?: number;
} & URLSearchParams>

export default async function DriveFilesPage(props: { params: Params, searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const params = await props.params

  console.log(searchParams);

  const search = searchParams?.search || "";
  const page = Number(searchParams?.page) || 1;

  const files = await getFiles({
    page,
    search,
    professor: searchParams.professor,
    module: searchParams.module,
    schoolYear: searchParams.schoolYear,
    academicYear: searchParams.academicYear,
    semester: Number(searchParams.semester) || undefined,
    section: searchParams.section,
    group: searchParams.group,
    speciality: searchParams.speciality,
    type: searchParams.type,
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Google Drive Files</h1>

      <SearchBar searchParams={searchParams} />

      {!files.length ? (
        <p className="text-center text-gray-500">No matching files found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <Card key={file.id} className="transition hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg truncate">{file.module}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p><strong>Type:</strong> {file.type}</p>
                <p><strong>Professor:</strong> {file.professor}</p>
                <p><strong>Academic Year:</strong> {file.academicYear}</p>
                <p><strong>School Year:</strong> {file.schoolYear}</p>
                <p><strong>Semester:</strong> {file.semester}</p>
                <div className="flex justify-end">
                  <Button variant="outline" asChild>
                    <Link href={file.url} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4 mr-2" /> View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
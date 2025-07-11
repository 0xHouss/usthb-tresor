import { fileTypeLabels, getFileDownloadUrl, getFileUrl } from "@/lib/utils";
import { DownloadIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { File } from "@prisma/client";

interface ResourceCardProps {
  file: File;
}

export default function ResourceCard({file}: ResourceCardProps) {
  return (
    <Card className="relative">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex items-center gap-4">
          <Link href={getFileDownloadUrl(file.id)} className="rounded-md bg-muted p-6 cursor-pointer" >
            <DownloadIcon className="w-5 h-5" />
          </Link>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-normal">{file.academicYear}/{file.academicYear + 1}</p>
            <CardTitle className="truncate hover:underline text-lg/[1em]">
              <Link href={getFileUrl(file.id)} target="_blank">
                {fileTypeLabels[file.type]} - {file.moduleName}
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
  )
}

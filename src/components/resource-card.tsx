import type { PublicFile } from "@/dal/files";
import { Link } from "@/i18n/navigation";
import { DownloadIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ResourceCardProps {
  file: PublicFile;
}

export default function ResourceCard({file}: ResourceCardProps) {
  const t = useTranslations("resourceCard")
  const tEnums = useTranslations("enums")

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex items-center gap-4">
          {/* A plain <a>: prefetching the download route would count phantom downloads. */}
          <a href={`/api/files/${file.id}/download`} className="rounded-md bg-muted p-6 cursor-pointer" aria-label={t("download")}>
            <DownloadIcon className="w-5 h-5" />
          </a>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-normal">{file.academicYear}/{file.academicYear + 1}</p>
            <CardTitle className="truncate hover:underline text-lg/[1em]">
              <Link href={`/files/${file.id}`}>
                {tEnums(`fileTypes.${file.type}`)} - {file.moduleName}
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
              <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">
                {tEnums(`languages.${file.language}`)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold">{t("details")}</h3>
        <div className="text-sm">
          <p>{t("major")} <span className="text-muted-foreground">{file.majorName}</span></p>
          <p>{t("professor")} <span className="text-muted-foreground">{file.professorFullName}</span></p>
        </div>
      </CardContent>
    </Card>
  )
}

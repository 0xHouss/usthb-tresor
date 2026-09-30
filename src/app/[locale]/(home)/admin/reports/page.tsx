import { PaginationWithLinks } from "@/components/pagination-with-links"
import { SearchParamSelect } from "@/components/search-param-select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getReports, REPORTS_PAGE_SIZE } from "@/dal/reports"
import { getCurrentUser } from "@/dal/session"
import { Link } from "@/i18n/navigation"
import { describeFile } from "@/lib/events"
import { parsePage } from "@/lib/search-params"
import { formatDateTime, isEnumValue } from "@/lib/utils"
import { FileType, ReportStatus } from "@prisma/client"
import { getLocale, getTranslations } from "next-intl/server"
import { ReportActions } from "./report-actions"

type ReportsSearchParams = Promise<{ status?: string; page?: string }>

const statusBadgeVariants = {
  [ReportStatus.Open]: "default",
  [ReportStatus.Resolved]: "secondary",
  [ReportStatus.Dismissed]: "outline",
} as const

export default async function ReportsPage(props: { searchParams: ReportsSearchParams }) {
  // The admin layout already restricts this area to moderators and admins.
  const [user, locale, t, tEnums] = await Promise.all([
    getCurrentUser(),
    getLocale(),
    getTranslations("reports"),
    getTranslations("enums"),
  ])
  const isAdmin = user?.role === "Admin"
  const fileLabels = { fileType: (type: FileType) => tEnums(`fileTypes.${type}`) }

  const searchParams = await props.searchParams
  const status = isEnumValue(ReportStatus, searchParams.status) ? searchParams.status : undefined
  const page = parsePage(searchParams.page)

  const { reports, totalCount } = await getReports({ status, page })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <SearchParamSelect
          param="status"
          value={status}
          options={Object.values(ReportStatus).map(value => ({ value, label: tEnums(`reportStatuses.${value}`) }))}
          allLabel={t("allStatuses")}
          aria-label={t("filterLabel")}
        />
      </div>

      {reports.length ? (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("columns.date")}</TableHead>
                  <TableHead>{t("columns.file")}</TableHead>
                  <TableHead>{t("columns.reason")}</TableHead>
                  <TableHead>{t("columns.reporter")}</TableHead>
                  <TableHead>{t("columns.status")}</TableHead>
                  <TableHead className="text-right">{/* Actions */}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map(report => (
                  <TableRow key={report.id} className="align-top">
                    <TableCell className="whitespace-nowrap">{formatDateTime(report.createdAt, locale)}</TableCell>
                    <TableCell>
                      {report.fileId ? (
                        <Link href={`/files/${report.fileId}`} className="hover:underline">
                          {describeFile(report.fileMetadata, fileLabels)}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">{t("deletedFile", { file: describeFile(report.fileMetadata, fileLabels) })}</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-sm whitespace-normal">
                      <p className="font-medium">{tEnums(`reportReasons.${report.reason}`)}</p>
                      {report.details && (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{report.details}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{report.reporter.name}</span>
                        <span className="text-xs text-muted-foreground">{report.reporter.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariants[report.status]}>{tEnums(`reportStatuses.${report.status}`)}</Badge>
                      {report.resolvedAt && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {report.resolvedBy
                            ? t("handledBy", { name: report.resolvedBy.name, date: formatDateTime(report.resolvedAt, locale) })
                            : t("handledOn", { date: formatDateTime(report.resolvedAt, locale) })}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      {report.status === ReportStatus.Open && (
                        <ReportActions
                          reportId={report.id}
                          deletableFileId={isAdmin && report.fileId ? report.fileId : undefined}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-center">
            <PaginationWithLinks page={page} pageSize={REPORTS_PAGE_SIZE} totalCount={totalCount} />
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">{t("empty")}</h3>
          <p className="text-muted-foreground mt-2">{t("emptyHint")}</p>
        </div>
      )}
    </div>
  )
}

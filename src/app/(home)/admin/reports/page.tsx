import { PaginationWithLinks } from "@/components/pagination-with-links"
import { SearchParamSelect } from "@/components/search-param-select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getReports, REPORTS_PAGE_SIZE } from "@/dal/reports"
import { getCurrentUser } from "@/dal/session"
import { describeFile } from "@/lib/events"
import { reportReasonLabels, reportStatusLabels } from "@/lib/reports"
import { parsePage } from "@/lib/search-params"
import { formatDateTime, isEnumValue } from "@/lib/utils"
import { ReportStatus } from "@prisma/client"
import Link from "next/link"
import { ReportActions } from "./report-actions"

type ReportsSearchParams = Promise<{ status?: string; page?: string }>

const statusBadgeVariants = {
  [ReportStatus.Open]: "default",
  [ReportStatus.Resolved]: "secondary",
  [ReportStatus.Dismissed]: "outline",
} as const

export default async function ReportsPage(props: { searchParams: ReportsSearchParams }) {
  // The admin layout already restricts this area to moderators and admins.
  const user = await getCurrentUser()
  const isAdmin = user?.role === "Admin"

  const searchParams = await props.searchParams
  const status = isEnumValue(ReportStatus, searchParams.status) ? searchParams.status : undefined
  const page = parsePage(searchParams.page)

  const { reports, totalCount } = await getReports({ status, page })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Signalements</h2>
          <p className="text-muted-foreground">Problèmes signalés par les utilisateurs sur les fichiers publiés</p>
        </div>
        <SearchParamSelect
          param="status"
          value={status}
          options={Object.values(ReportStatus).map(value => ({ value, label: reportStatusLabels[value] }))}
          allLabel="Tous les statuts"
          aria-label="Filtrer par statut"
        />
      </div>

      {reports.length ? (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Fichier</TableHead>
                  <TableHead>Motif</TableHead>
                  <TableHead>Signalé par</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">{/* Actions */}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map(report => (
                  <TableRow key={report.id} className="align-top">
                    <TableCell className="whitespace-nowrap">{formatDateTime(report.createdAt)}</TableCell>
                    <TableCell>
                      {report.fileId ? (
                        <Link href={`/files/${report.fileId}`} className="hover:underline">
                          {describeFile(report.fileMetadata)}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">{describeFile(report.fileMetadata)} (supprimé)</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-sm whitespace-normal">
                      <p className="font-medium">{reportReasonLabels[report.reason]}</p>
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
                      <Badge variant={statusBadgeVariants[report.status]}>{reportStatusLabels[report.status]}</Badge>
                      {report.resolvedAt && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {report.resolvedBy ? `par ${report.resolvedBy.name}, ` : ""}le {formatDateTime(report.resolvedAt)}
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
          <h3 className="text-lg font-medium">Aucun signalement</h3>
          <p className="text-muted-foreground mt-2">Rien à traiter pour ce filtre.</p>
        </div>
      )}
    </div>
  )
}

import { PaginationWithLinks } from "@/components/pagination-with-links"
import { SearchParamSelect } from "@/components/search-param-select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EVENTS_PAGE_SIZE, getEvents } from "@/dal/events"
import { getCurrentUser } from "@/dal/session"
import { redirect } from "@/i18n/navigation"
import { describeEvent, type DescribeLabels } from "@/lib/events"
import { parsePage } from "@/lib/search-params"
import { formatDateTime, isEnumValue } from "@/lib/utils"
import { EventType } from "@prisma/client"
import { getLocale, getTranslations } from "next-intl/server"

type LogsSearchParams = Promise<{ type?: string; page?: string }>

export default async function LogsPage(props: { searchParams: LogsSearchParams }) {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()])
  if (user?.role !== "Admin") return redirect({ href: "/", locale })

  const searchParams = await props.searchParams
  const type = isEnumValue(EventType, searchParams.type) ? searchParams.type : undefined
  const page = parsePage(searchParams.page)

  const [{ events, totalCount }, t, tEnums, tEvents] = await Promise.all([
    getEvents({ type, page }),
    getTranslations("logs"),
    getTranslations("enums"),
    getTranslations("events"),
  ])

  const labels: DescribeLabels = {
    fileType: fileType => tEnums(`fileTypes.${fileType}`),
    reason: reason => tEnums(`reportReasons.${reason}`),
    anonymous: tEvents("anonymous"),
    moderated: tEvents("moderated"),
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle", { count: totalCount })}</p>
        </div>
        <SearchParamSelect
          param="type"
          value={type}
          options={Object.values(EventType).map(value => ({ value, label: tEnums(`eventTypes.${value}`) }))}
          allLabel={t("allEvents")}
          aria-label={t("filterLabel")}
        />
      </div>

      {events.length ? (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("columns.date")}</TableHead>
                  <TableHead>{t("columns.event")}</TableHead>
                  <TableHead>{t("columns.user")}</TableHead>
                  <TableHead>{t("columns.details")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map(event => (
                  <TableRow key={event.id}>
                    <TableCell className="whitespace-nowrap">{formatDateTime(event.createdAt, locale)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{tEnums(`eventTypes.${event.type}`)}</Badge>
                    </TableCell>
                    <TableCell>
                      {event.actor ? (
                        <div className="flex flex-col">
                          <span>{event.actor.name}</span>
                          <span className="text-xs text-muted-foreground">{event.actor.email}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{describeEvent(event.metadata, labels)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-center">
            <PaginationWithLinks page={page} pageSize={EVENTS_PAGE_SIZE} totalCount={totalCount} />
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

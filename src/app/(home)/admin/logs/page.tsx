import { PaginationWithLinks } from "@/components/pagination-with-links"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EVENTS_PAGE_SIZE, getEvents } from "@/dal/events"
import { getCurrentUser } from "@/dal/session"
import { describeEvent, eventTypeLabels } from "@/lib/events"
import { parsePage } from "@/lib/search-params"
import { formatDateTime, isEnumValue } from "@/lib/utils"
import { EventType } from "@prisma/client"
import { redirect } from "next/navigation"
import { EventTypeFilter } from "./event-type-filter"

type LogsSearchParams = Promise<{ type?: string; page?: string }>

export default async function LogsPage(props: { searchParams: LogsSearchParams }) {
  const user = await getCurrentUser()
  if (user?.role !== "Admin") redirect("/")

  const searchParams = await props.searchParams
  const type = isEnumValue(EventType, searchParams.type) ? searchParams.type : undefined
  const page = parsePage(searchParams.page)

  const { events, totalCount } = await getEvents({ type, page })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Journal d&apos;activité</h2>
          <p className="text-muted-foreground">
            Connexions et actions de modération ({totalCount} entrée{totalCount !== 1 ? "s" : ""})
          </p>
        </div>
        <EventTypeFilter value={type} />
      </div>

      {events.length ? (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Événement</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Détails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map(event => (
                  <TableRow key={event.id}>
                    <TableCell className="whitespace-nowrap">{formatDateTime(event.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{eventTypeLabels[event.type]}</Badge>
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
                    <TableCell>{describeEvent(event.metadata)}</TableCell>
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
          <h3 className="text-lg font-medium">Aucun événement</h3>
          <p className="text-muted-foreground mt-2">Rien n&apos;a encore été enregistré pour ce filtre.</p>
        </div>
      )}
    </div>
  )
}

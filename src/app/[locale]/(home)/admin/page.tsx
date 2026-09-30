import { UserAvatar } from "@/components/user-avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getDailyActivity,
  getDashboardStats,
  getTopContributors,
  getTopDownloadedFiles,
} from "@/dal/stats"
import { Link } from "@/i18n/navigation"
import { formatCompact } from "@/lib/stats"
import { getLocale, getTranslations } from "next-intl/server"
import { DailyColumnChart } from "./daily-column-chart"

export default async function AdminDashboardPage() {
  // The admin layout already restricts this area to moderators and admins.
  const [stats, activity, topFiles, topContributors, locale, t, tEnums] = await Promise.all([
    getDashboardStats(),
    getDailyActivity(),
    getTopDownloadedFiles(),
    getTopContributors(),
    getLocale(),
    getTranslations("dashboard"),
    getTranslations("enums"),
  ])

  const tiles = [
    { label: t("tiles.files"), value: stats.files },
    { label: t("tiles.pendingFiles"), value: stats.pendingFiles, href: "/submissions" },
    { label: t("tiles.openReports"), value: stats.openReports, href: "/admin/reports?status=Open" },
    { label: t("tiles.users"), value: stats.users },
    { label: t("tiles.recentDownloads"), value: stats.recentDownloads },
    { label: t("tiles.comments"), value: stats.comments },
  ]

  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {tiles.map(tile => {
          const content = (
            <>
              <p className="text-sm text-muted-foreground">{tile.label}</p>
              <p className="text-3xl font-semibold">{formatCompact(tile.value, locale)}</p>
            </>
          )
          return tile.href ? (
            <Link key={tile.label} href={tile.href} className="flex flex-col gap-1 rounded-lg border p-4 transition-colors hover:bg-accent">
              {content}
            </Link>
          ) : (
            <div key={tile.label} className="flex flex-col gap-1 rounded-lg border p-4">
              {content}
            </div>
          )
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DailyColumnChart title={t("downloadsPerDay")} data={activity.downloads} unit="downloads" />
        <DailyColumnChart title={t("submissionsPerDay")} data={activity.submissions} unit="submissions" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("topFiles")}</CardTitle>
          </CardHeader>
          <CardContent>
            {topFiles.length ? (
              <ol className="flex flex-col gap-3">
                {topFiles.map((file, i) => (
                  <li key={file.id} className="flex items-center gap-3 text-sm">
                    <span className="w-5 text-muted-foreground tabular-nums">{i + 1}</span>
                    <Link href={`/files/${file.id}`} className="flex-1 truncate hover:underline">
                      {tEnums(`fileTypes.${file.type}`)} - {file.moduleName} ({file.academicLevel})
                    </Link>
                    <span className="tabular-nums text-muted-foreground">{file.downloads}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">{t("noDownloads")}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("topContributors")}</CardTitle>
          </CardHeader>
          <CardContent>
            {topContributors.length ? (
              <ol className="flex flex-col gap-3">
                {topContributors.map((contributor, i) => (
                  <li key={contributor.id} className="flex items-center gap-3 text-sm">
                    <span className="w-5 text-muted-foreground tabular-nums">{i + 1}</span>
                    <UserAvatar name={contributor.name} image={contributor.image} />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">{contributor.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{contributor.email}</span>
                    </div>
                    <span className="tabular-nums text-muted-foreground">
                      {t("fileCount", { count: contributor.files })}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">{t("noFiles")}</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

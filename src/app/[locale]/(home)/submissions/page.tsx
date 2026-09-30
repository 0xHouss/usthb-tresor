import { PendingFilesTable } from "@/components/pending-files-table"
import { getCurrentUser } from "@/dal/session"
import { getPendingFiles } from "@/dal/pending-files"
import { redirect } from "@/i18n/navigation"
import { getLocale, getTranslations } from "next-intl/server"

export default async function DashboardPage() {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()])

  if (!user) {
    return redirect({ href: "/login", locale })
  } else if (!["Admin", "Moderator"].includes(user.role)) {
    return redirect({ href: "/", locale })
  }

  const [pendingFiles, t] = await Promise.all([getPendingFiles(), getTranslations("submissions")])

  return (
    <div className="flex flex-col p-10 gap-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>
      <PendingFilesTable pendingFiles={pendingFiles} />
    </div>
  )
}

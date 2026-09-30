import { buttonVariants } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export default function NotFound() {
  const t = useTranslations("notFound")

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
      <p className="text-muted-foreground">{t("text")}</p>
      <Link href="/" className={buttonVariants()}>{t("back")}</Link>
    </main>
  )
}

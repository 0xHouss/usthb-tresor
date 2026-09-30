import { NavLink } from "@/components/nav-link"
import { getCurrentUser } from "@/dal/session"
import { redirect } from "@/i18n/navigation"
import type { SessionUser } from "@/lib/auth"
import { getLocale, getTranslations } from "next-intl/server"

type AdminSection = { href: string; key: "dashboard" | "reports" | "logs"; roles: SessionUser["role"][] }

// Each admin page registers its entry here; pages still enforce their own role checks.
const sections: AdminSection[] = [
  { href: "/admin", key: "dashboard", roles: ["Admin", "Moderator"] },
  { href: "/admin/reports", key: "reports", roles: ["Admin", "Moderator"] },
  { href: "/admin/logs", key: "logs", roles: ["Admin"] },
]

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, locale, t] = await Promise.all([getCurrentUser(), getLocale(), getTranslations("admin")])

  if (!user) {
    return redirect({ href: "/login", locale })
  } else if (!["Admin", "Moderator"].includes(user.role)) {
    return redirect({ href: "/", locale })
  }

  const visibleSections = sections.filter(section => section.roles.includes(user.role))

  return (
    <div className="flex flex-col p-10 gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <nav className="flex flex-wrap items-center -ml-3 border-b">
          {visibleSections.map(section => (
            <NavLink key={section.href} href={section.href} label={t(`sections.${section.key}`)} />
          ))}
        </nav>
      </div>
      {children}
    </div>
  )
}

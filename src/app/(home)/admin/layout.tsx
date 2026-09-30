import { NavLink } from "@/components/nav-link"
import { getCurrentUser } from "@/dal/session"
import type { SessionUser } from "@/lib/auth"
import { redirect } from "next/navigation"

type AdminSection = { href: string; label: string; roles: SessionUser["role"][] }

// Each admin page registers its entry here; pages still enforce their own role checks.
const sections: AdminSection[] = [
  { href: "/admin/logs", label: "Journal", roles: ["Admin"] },
]

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  } else if (!["Admin", "Moderator"].includes(user.role)) {
    redirect("/")
  }

  const visibleSections = sections.filter(section => section.roles.includes(user.role))

  return (
    <div className="flex flex-col p-10 gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">Administration</h1>
        <nav className="flex flex-wrap items-center -ml-3 border-b">
          {visibleSections.map(section => (
            <NavLink key={section.href} href={section.href} label={section.label} />
          ))}
        </nav>
      </div>
      {children}
    </div>
  )
}

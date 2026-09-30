import { getCurrentUser } from "@/dal/session"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { LocaleSwitcher } from "./locale-switcher"
import MobileHeaderMenu from "./mobile-header-menu"
import { NavLink } from "./nav-link"
import { buttonVariants } from "./ui/button"
import UserButton from "./user-button"

export async function Header() {
  const [user, t] = await Promise.all([getCurrentUser(), getTranslations("nav")])
  const isStaff = user?.role === "Admin" || user?.role === "Moderator"

  return (
    <header className="sticky top-0 border-b-2 bg-background z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Image src="/usthb-logo.png" alt="Logo" height={38} width={42} />
            <p className="text-lg">
            USTHB <br /> Trésor
            </p>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink href="/browse" label={t("resources")} />
            <NavLink href="/contribute" label={t("contribute")} />
            <NavLink href="/contact" label={t("contact")} />

            {isStaff && (
              <>
                <NavLink href="/submissions" label={t("submissions")} />
                <NavLink href="/admin" label={t("administration")} />
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 items-center">
          <LocaleSwitcher />

          {user ? (
            <UserButton user={user} />
          ) : (
            <Link className={buttonVariants()} href="/login">
              {t("login")}
            </Link>
          )}

          <MobileHeaderMenu user={user} />
        </div>
      </nav>


    </header>
  )
}

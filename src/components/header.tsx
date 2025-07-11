import { auth } from "@/lib/auth"
import Image from "next/image"
import Link from "next/link"
import MobileHeaderMenu from "./mobile-header-menu"
import { NavLink } from "./nav-link"
import { buttonVariants } from "./ui/button"
import UserButton from "./user-button"

export async function Header() {
  const session = await auth()
  const user = session?.user;

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
            <NavLink href="/browse" label="Resources"  />
            <NavLink href="/contribute" label="Contribute" />
            <NavLink href="/contact" label="Contact Us" />

            {["Admin", "Moderator"].includes(user?.role || "Visitor") && (
              <NavLink href="/submissions" label="Submissions" />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 items-center">
          {user ? (
            <UserButton user={user} />
          ) : (
            <Link className={buttonVariants()} href="/login">
              Login
            </Link>
          )}

          <MobileHeaderMenu user={user} />
        </div>
      </nav>


    </header>
  )
}

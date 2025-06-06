"use client"

import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { User } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { NavLink } from "./nav-link"
import { Button, buttonVariants } from "./ui/button"
import UserDropdown from "./user-dropdown"

interface NavbarProps {
  user: User | undefined
}

export function Navbar({ user }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="sticky top-0 border-b-2 bg-background z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/usthb-logo.png" alt="Logo" height={38} width={42} />
            <span className="leading-4 text-sm sm:text-base">
              USTHB
              <br />
              TRÉSOR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink href="/browse" label="Resources" />
            <NavLink href="/contribute" label="Contribute" />
            <NavLink href="/contact" label="Contact Us" />

            {user?.role === "Admin" && (
              <NavLink href="/admin" label="Dashboard" />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 items-center">
          {user ? (
            <UserDropdown user={user} />
          ) : (
            <Link className={buttonVariants()} href="/login">
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden border-t bg-background transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden",
        )}
      >
        <div className="px-4 py-4 space-y-4">
          {/* Mobile Navigation Links */}
          <div className="flex flex-col space-y-3">
            <Link
              href="/browse"
              className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
              onClick={closeMobileMenu}
            >
              Resources
            </Link>
            <Link
              href="/contribute"
              className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
              onClick={closeMobileMenu}
            >
              Contribute
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
              onClick={closeMobileMenu}
            >
              Contact Us
            </Link>

            {user?.role === "Admin" && (
              <Link
                href="/admin"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

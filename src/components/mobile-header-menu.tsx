"use client";

import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'
import { useState } from 'react';
import type { SessionUser } from '@/lib/auth';

interface MobileHeaderMenuProps {
  user: SessionUser | null;
}

const linkClassName = "block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"

export default function MobileHeaderMenu({ user }: MobileHeaderMenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  const isStaff = user?.role === "Admin" || user?.role === "Moderator"

  const links = [
    { href: "/browse", label: "Resources" },
    { href: "/contribute", label: "Contribute" },
    { href: "/contact", label: "Contact Us" },
    ...(isStaff
      ? [
          { href: "/submissions", label: "Submissions" },
          { href: "/admin", label: "Administration" },
        ]
      : []),
  ]

  return (
    <>
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

      <div
        className={
          cn(
            "md:hidden border-t bg-background transition-all absolute top-20 left-0 right-0 duration-300 ease-in-out",
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden",
          )
        }
      >
        <div className="px-4 py-4 space-y-4">
          <div className="flex flex-col space-y-3">
            {links.map(link => (
              <Link key={link.href} href={link.href} className={linkClassName} onClick={closeMobileMenu}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

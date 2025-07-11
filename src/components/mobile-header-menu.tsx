"use client";

import { cn } from '@/lib/utils'
import { Link, Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react';
import { User } from 'next-auth';

interface MobileHeaderMenuProps {
  user: User | undefined;
}

export default function MobileHeaderMenu({ user }: MobileHeaderMenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev)
  const closeMobileMenu = () => setMobileMenuOpen(false)

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
                href="/dashboard"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

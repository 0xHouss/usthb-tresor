"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-5">
      <Link
        href={href}
        className={cn('opacity-50 hover:opacity-100 transition-all', {
          'opacity-100': pathname === href,
        })}
      >
        {label}
      </Link>
    </div>
  );
}

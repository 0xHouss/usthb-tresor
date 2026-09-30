"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-5">
      <Link
        href={href}
        className={cn('opacity-50 hover:opacity-100 transition-all p-3', {
          'opacity-100 font-semibold': pathname === href,
        })}
      >
        {label}
      </Link>
    </div>
  );
}

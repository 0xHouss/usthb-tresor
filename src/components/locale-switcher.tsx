"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "@/i18n/navigation"
import { type AppLocale, routing } from "@/i18n/routing"
import { CheckIcon, LanguagesIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useTransition } from "react"

export function LocaleSwitcher() {
  const t = useTranslations("localeSwitcher")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()

  // Stays on the same page, keeping its filters; the proxy remembers the choice in a cookie.
  const switchTo = (next: AppLocale) => {
    startTransition(() => router.replace(`${pathname}${window.location.search}`, { locale: next }))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={pending} aria-label={t("label")}>
          <LanguagesIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map(option => (
          <DropdownMenuItem key={option} lang={option} onClick={() => switchTo(option)}>
            <CheckIcon className={option === locale ? "opacity-100" : "opacity-0"} />
            {t(option)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

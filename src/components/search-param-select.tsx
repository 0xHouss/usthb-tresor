"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const ALL = "all"

interface SearchParamSelectProps {
  /** Query-string key the selection is stored under. */
  param: string
  value?: string
  options: { value: string; label: string }[]
  /** Label of the "no filter" option. */
  allLabel: string
  "aria-label": string
}

/** A Select that filters a list page through a query-string param, resetting pagination. */
export function SearchParamSelect({ param, value, options, allLabel, "aria-label": ariaLabel }: SearchParamSelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (selected: string) => {
    const params = new URLSearchParams(searchParams)
    if (selected === ALL) params.delete(param)
    else params.set(param, selected)
    params.delete("page") // A new filter starts from the first page.
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Select value={value ?? ALL} onValueChange={handleChange}>
      <SelectTrigger className="w-56" aria-label={ariaLabel}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{allLabel}</SelectItem>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { eventTypeLabels } from "@/lib/events"
import { EventType } from "@prisma/client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const ALL = "all"

export function EventTypeFilter({ value }: { value?: EventType }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (type: string) => {
    const params = new URLSearchParams(searchParams)
    if (type === ALL) params.delete("type")
    else params.set("type", type)
    params.delete("page") // A new filter starts from the first page.
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Select value={value ?? ALL} onValueChange={handleChange}>
      <SelectTrigger className="w-56" aria-label="Filtrer par type d'événement">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>Tous les événements</SelectItem>
        {Object.values(EventType).map(type => (
          <SelectItem key={type} value={type}>{eventTypeLabels[type]}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

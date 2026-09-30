"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { type DailyCount, formatDay, niceCeil } from "@/lib/stats"
import { useLocale, useTranslations } from "next-intl"

interface DailyColumnChartProps {
  title: string
  data: DailyCount[]
  /** What is counted; picks the pluralized unit from the `chart.units` messages. */
  unit: "downloads" | "submissions"
}

/** A single-series column chart of daily counts, with per-column tooltips and a data table. */
export function DailyColumnChart({ title, data, unit }: DailyColumnChartProps) {
  const t = useTranslations("chart")
  const locale = useLocale()
  const withUnit = (count: number) => t(`units.${unit}`, { count })
  const day = (key: string) => formatDay(key, locale)
  const total = data.reduce((sum, d) => sum + d.count, 0)
  const peak = Math.max(0, ...data.map(d => d.count))
  const max = niceCeil(peak)
  const ticks = max >= 2 ? [max, max / 2, 0] : [max, 0]
  const peakIndex = peak > 0 ? data.findIndex(d => d.count === peak) : -1
  const xLabels = [data[0], data[Math.floor(data.length / 2)], data[data.length - 1]]

  return (
    <figure className="flex flex-col gap-4 rounded-lg border p-4">
      <figcaption>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">
          {t("total", { total: withUnit(total), days: data.length })}
        </p>
      </figcaption>

      <div className="flex gap-2 pt-5">
        {/* Y axis */}
        <div className="relative h-40 w-8 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
          {ticks.map(tick => (
            <span key={tick} className="absolute right-0 -translate-y-1/2" style={{ top: `${100 - (tick / max) * 100}%` }}>
              {tick}
            </span>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-2 min-w-0">
          <div className="relative h-40">
            {/* Gridlines */}
            {ticks.map(tick => (
              <div key={tick} className="absolute inset-x-0 border-t border-border" style={{ top: `${100 - (tick / max) * 100}%` }} />
            ))}

            {/* Columns: the full-height column is the hit target, the bar is the mark. */}
            <div className="absolute inset-0 flex items-end gap-[2px]">
              {data.map((d, i) => (
                <Tooltip key={d.day}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="group relative flex h-full flex-1 items-end justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={t("columnLabel", { day: day(d.day), value: withUnit(d.count) })}
                    >
                      <div
                        className="relative w-full max-w-6 rounded-t-[4px] bg-primary transition-opacity group-hover:opacity-75 group-focus-visible:opacity-75"
                        style={{ height: `${(d.count / max) * 100}%` }}
                      >
                        {i === peakIndex && (
                          <span className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 text-xs font-medium tabular-nums">
                            {d.count}
                          </span>
                        )}
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">{withUnit(d.count)}</p>
                    <p className="opacity-75">{day(d.day)}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* X axis */}
          <div className="flex justify-between text-xs text-muted-foreground">
            {xLabels.map(d => (
              <span key={d.day}>{day(d.day)}</span>
            ))}
          </div>
        </div>
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">{t("showData")}</summary>
        <table className="mt-2 w-full tabular-nums">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="font-normal">{t("day")}</th>
              <th className="font-normal text-right">{t("count")}</th>
            </tr>
          </thead>
          <tbody>
            {data.map(d => (
              <tr key={d.day}>
                <td>{day(d.day)}</td>
                <td className="text-right">{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  )
}

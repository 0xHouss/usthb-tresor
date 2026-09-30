"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { type DailyCount, formatDay, niceCeil } from "@/lib/stats"

interface DailyColumnChartProps {
  title: string
  data: DailyCount[]
  /** Unit label, singular and plural, e.g. ["téléchargement", "téléchargements"]. */
  unit: [string, string]
}

const pluralize = (count: number, [one, other]: [string, string]) => (count > 1 ? other : one)

/** A single-series column chart of daily counts, with per-column tooltips and a data table. */
export function DailyColumnChart({ title, data, unit }: DailyColumnChartProps) {
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
          {total} {pluralize(total, unit)} sur {data.length} jours
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
                      aria-label={`${formatDay(d.day)} : ${d.count} ${pluralize(d.count, unit)}`}
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
                    <p>
                      <span className="font-semibold">{d.count}</span> {pluralize(d.count, unit)}
                    </p>
                    <p className="opacity-75">{formatDay(d.day)}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* X axis */}
          <div className="flex justify-between text-xs text-muted-foreground">
            {xLabels.map(d => (
              <span key={d.day}>{formatDay(d.day)}</span>
            ))}
          </div>
        </div>
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Voir les données</summary>
        <table className="mt-2 w-full tabular-nums">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="font-normal">Jour</th>
              <th className="font-normal text-right">Nombre</th>
            </tr>
          </thead>
          <tbody>
            {data.map(d => (
              <tr key={d.day}>
                <td>{formatDay(d.day)}</td>
                <td className="text-right">{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  )
}

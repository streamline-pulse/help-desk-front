import {
  IconClock,
  IconMoodSmile,
  IconTicket,
  IconTrendingDown,
  IconTrendingUp,
  IconCircleCheck,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { DashboardKpi } from "@/config/dashboard-mock"
import { cn } from "@/lib/utils"

const kpiIcons = {
  "open-requests": IconTicket,
  "resolved-month": IconCircleCheck,
  "first-response": IconClock,
  satisfaction: IconMoodSmile,
} as const

type DashboardStatCardsProps = {
  items: DashboardKpi[]
}

function TrendBadge({
  change,
  intent,
  trend,
}: Pick<DashboardKpi, "change" | "intent" | "trend">) {
  const TrendIcon =
    trend === "up"
      ? IconTrendingUp
      : trend === "down"
        ? IconTrendingDown
        : null

  return (
    <Badge
      variant="outline"
      className={cn(
        "tabular-nums",
        intent === "positive" && "border-primary/20 text-primary",
        intent === "negative" && "border-destructive/20 text-destructive"
      )}
    >
      {TrendIcon ? <TrendIcon data-icon="inline-start" /> : null}
      {change}
    </Badge>
  )
}

export function DashboardStatCards({ items }: DashboardStatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = kpiIcons[item.id as keyof typeof kpiIcons]

        return (
          <Card key={item.id} size="sm">
            <CardHeader className="border-b">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <CardDescription>{item.label}</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums">
                    {item.value}
                  </CardTitle>
                </div>
                {Icon ? (
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                    <Icon className="size-4" stroke={1.75} />
                  </div>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-2 pt-3">
              <TrendBadge
                change={item.change}
                intent={item.intent}
                trend={item.trend}
              />
              <span className="text-xs text-muted-foreground">
                {item.changeLabel}
              </span>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

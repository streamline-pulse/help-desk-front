"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@/components/ui/progress"
import type {
  AgentWorkloadPoint,
  PrioritySharePoint,
  StatusVolumePoint,
  WeeklyVolumePoint,
} from "@/config/dashboard-mock"
import { slaCompliance } from "@/config/dashboard-mock"

const volumeChartConfig = {
  opened: {
    label: "Ouvertes",
    color: "var(--chart-1)",
  },
  resolved: {
    label: "Résolues",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

const statusChartConfig = {
  count: {
    label: "Demandes",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const priorityChartConfig = {
  Basse: { label: "Basse", color: "var(--chart-4)" },
  Normale: { label: "Normale", color: "var(--chart-2)" },
  Haute: { label: "Haute", color: "var(--chart-3)" },
  Critique: { label: "Critique", color: "var(--chart-1)" },
} satisfies ChartConfig

const workloadChartConfig = {
  open: {
    label: "Ouvertes",
    color: "var(--chart-1)",
  },
  resolved: {
    label: "Résolues",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

type DashboardChartsProps = {
  weeklyVolume: WeeklyVolumePoint[]
  statusVolume: StatusVolumePoint[]
  priorityShare: PrioritySharePoint[]
  agentWorkload: AgentWorkloadPoint[]
}

export function DashboardCharts({
  weeklyVolume,
  statusVolume,
  priorityShare,
  agentWorkload,
}: DashboardChartsProps) {
  const totalPriority = priorityShare.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="border-b">
            <CardTitle>Volume hebdomadaire</CardTitle>
            <CardDescription>
              Ouvertures et résolutions sur les 7 derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer
              config={volumeChartConfig}
              className="aspect-auto h-[280px] w-full"
            >
              <AreaChart data={weeklyVolume} accessibilityLayer>
                <defs>
                  <linearGradient id="fillOpened" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-opened)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-opened)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                  <linearGradient id="fillResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-resolved)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-resolved)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  dataKey="opened"
                  type="monotone"
                  fill="url(#fillOpened)"
                  stroke="var(--color-opened)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="resolved"
                  type="monotone"
                  fill="url(#fillResolved)"
                  stroke="var(--color-resolved)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Respect des SLA</CardTitle>
            <CardDescription>{slaCompliance.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 pt-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-semibold tabular-nums">
                  {slaCompliance.value}%
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Objectif {slaCompliance.target}%
                </p>
              </div>
              <div className="rounded-lg border bg-muted/30 px-3 py-2 text-right">
                <p className="text-xs text-muted-foreground">Écart</p>
                <p className="font-medium tabular-nums text-destructive">
                  −{slaCompliance.target - slaCompliance.value} pts
                </p>
              </div>
            </div>
            <Progress value={slaCompliance.value}>
              <div className="flex w-full items-center justify-between gap-2">
                <ProgressLabel>{slaCompliance.label}</ProgressLabel>
                <ProgressValue />
              </div>
              <ProgressTrack>
                <ProgressIndicator />
              </ProgressTrack>
            </Progress>
            <p className="text-xs text-pretty text-muted-foreground">
              Données simulées — le suivi SLA sera branché sur les demandes
              réelles.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Par statut</CardTitle>
            <CardDescription>Répartition actuelle du backlog</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer
              config={statusChartConfig}
              className="aspect-auto h-[260px] w-full"
            >
              <BarChart data={statusVolume} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="status"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} width={28} />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusVolume.map((entry) => (
                    <Cell key={entry.status} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Par priorité</CardTitle>
            <CardDescription>Part du volume total traité</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer
              config={priorityChartConfig}
              className="mx-auto aspect-square h-[260px] w-full max-w-[280px]"
            >
              <PieChart accessibilityLayer>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={priorityShare}
                  dataKey="count"
                  nameKey="priority"
                  innerRadius={58}
                  outerRadius={92}
                  strokeWidth={2}
                >
                  {priorityShare.map((entry) => (
                    <Cell key={entry.priority} fill={entry.fill} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-2xl font-semibold"
                            >
                              {totalPriority}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy ?? 0) + 18}
                              className="fill-muted-foreground text-xs"
                            >
                              demandes
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="priority" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Charge par agent</CardTitle>
            <CardDescription>Top 5 — file ouverte vs résolues</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer
              config={workloadChartConfig}
              className="aspect-auto h-[260px] w-full"
            >
              <BarChart
                data={agentWorkload}
                layout="vertical"
                accessibilityLayer
              >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="agent"
                  tickLine={false}
                  axisLine={false}
                  width={72}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="open"
                  stackId="workload"
                  fill="var(--color-open)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="resolved"
                  stackId="workload"
                  fill="var(--color-resolved)"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

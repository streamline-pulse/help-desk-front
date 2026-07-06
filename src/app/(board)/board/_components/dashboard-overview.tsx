import { IconLayoutDashboard } from "@tabler/icons-react"

import { DashboardCharts } from "@/app/(board)/board/_components/dashboard-charts"
import { DashboardRecentTickets } from "@/app/(board)/board/_components/dashboard-recent-tickets"
import { DashboardStatCards } from "@/app/(board)/board/_components/dashboard-stat-cards"
import { PageHeader } from "@/components/shared/page/page.header"
import {
  agentWorkload,
  dashboardKpis,
  priorityShare,
  recentTickets,
  statusVolume,
  weeklyVolume,
} from "@/config/dashboard-mock"

export function DashboardOverview() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        label="Vue d’ensemble"
        title="Tableau de bord"
        description="Suivez l’activité du centre de support, la charge des équipes et la santé de la file de traitement."
        icon={IconLayoutDashboard}
      />

      <div className="flex flex-col gap-6 px-6 pb-10">
        <DashboardStatCards items={dashboardKpis} />
        <DashboardCharts
          weeklyVolume={weeklyVolume}
          statusVolume={statusVolume}
          priorityShare={priorityShare}
          agentWorkload={agentWorkload}
        />
        <DashboardRecentTickets tickets={recentTickets} />
      </div>
    </div>
  )
}

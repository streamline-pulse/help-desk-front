import type { TablerIcon } from "@tabler/icons-react"
import {
  IconChartBar,
  IconChecklist,
  IconInbox,
  IconLayoutDashboard,
  IconSettings,
  IconTicket,
  IconUserHeart,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react"

import { routes } from "@/config/routes"

export const moduleCodes = {
  dashboard: "DASHBOARD",
  employees: "EMPLOYEES",
  requests: "REQUESTS",
  inbox: "INBOX",
  customers: "CUSTOMERS",
  approvals: "APPROVALS",
  teams: "TEAMS",
  statistics: "STATISTICS",
  settings: "SETTINGS",
} as const

export type ModuleCode = (typeof moduleCodes)[keyof typeof moduleCodes]

export type NavigationItem = {
  title: string
  url: string
  icon: TablerIcon
  moduleCode: ModuleCode
  isReady: boolean
}

export const navigationItems = [
  {
    title: "Vue d’ensemble",
    url: routes.board.root,
    icon: IconLayoutDashboard,
    moduleCode: moduleCodes.dashboard,
    isReady: true,
  },
  {
    title: "Employés",
    url: routes.board.employees,
    icon: IconUsers,
    moduleCode: moduleCodes.employees,
    isReady: true,
  },
  {
    title: "Demandes",
    url: routes.requests.all,
    icon: IconTicket,
    moduleCode: moduleCodes.requests,
    isReady: false,
  },
  {
    title: "Boîte de réception",
    url: routes.inbox.all,
    icon: IconInbox,
    moduleCode: moduleCodes.inbox,
    isReady: false,
  },
  {
    title: "Clients",
    url: routes.customers.all,
    icon: IconUserHeart,
    moduleCode: moduleCodes.customers,
    isReady: false,
  },
  {
    title: "Approbations",
    url: routes.approvals.all,
    icon: IconChecklist,
    moduleCode: moduleCodes.approvals,
    isReady: false,
  },
  {
    title: "Équipes",
    url: routes.teams.all,
    icon: IconUsersGroup,
    moduleCode: moduleCodes.teams,
    isReady: false,
  },
  {
    title: "Statistiques",
    url: routes.statistics.all,
    icon: IconChartBar,
    moduleCode: moduleCodes.statistics,
    isReady: false,
  },
  {
    title: "Paramètres",
    url: routes.settings.root,
    icon: IconSettings,
    moduleCode: moduleCodes.settings,
    isReady: false,
  },
] as const satisfies readonly NavigationItem[]

export function isModuleRouteAvailable(pathname: string) {
  const matchingItem = navigationItems
    .filter(
      (item) => pathname === item.url || pathname.startsWith(`${item.url}/`)
    )
    .sort((first, second) => second.url.length - first.url.length)[0]

  return matchingItem?.isReady ?? true
}

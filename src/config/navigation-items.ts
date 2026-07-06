import type { TablerIcon } from "@tabler/icons-react"
import {
  IconChartBar,
  IconAdjustments,
  IconChecklist,
  IconInbox,
  IconLayoutDashboard,
  IconSettings,
  IconShieldLock,
  IconTicket,
  IconUser,
  IconUserHeart,
  IconUsers,
  IconUsersGroup,
  IconCategory,
} from "@tabler/icons-react"

import { routes } from "@/config/routes"

export const moduleCodes = {
  dashboard: "DASHBOARD",
  employees: "EMPLOYEES",
  users: "USERS",
  requests: "REQUESTS",
  inbox: "INBOX",
  customers: "CUSTOMERS",
  approvals: "APPROVALS",
  teams: "TEAMS",
  statistics: "STATISTICS",
  settings: "SETTINGS",
  configuration: "CONFIGURATION",
  roles: "ROLES",
  groupConfiguration: "GROUP_CONFIGURATION",
  groups: "GROUPS",
  groupSpace: "GROUP_SPACE",
} as const

export type ModuleCode = (typeof moduleCodes)[keyof typeof moduleCodes]

export type NavigationLinkItem = {
  type: "link"
  title: string
  url: string
  icon: TablerIcon
  moduleCode: ModuleCode
  isReady: boolean
}

export type NavigationSectionItem = {
  type: "section"
  title: string
  id: string
}

export type NavigationItem = NavigationLinkItem | NavigationSectionItem

export const navigationItems = [
  // {
  //   type: "section",
  //   id: "group-space",
  //   title: "Espace groupe",
  // },
  {
    type: "link",
    title: "Vue d’ensemble",
    url: routes.board.root,
    icon: IconLayoutDashboard,
    moduleCode: moduleCodes.dashboard,
    isReady: true,
  },
  {
    type: "link",
    title: "Espace groupe",
    url: routes.board.groupSpace.root,
    icon: IconUsersGroup,
    moduleCode: moduleCodes.groupSpace,
    isReady: true,
  },
  {
    type: "link",
    title: "Demandes",
    url: routes.requests.all,
    icon: IconTicket,
    moduleCode: moduleCodes.requests,
    isReady: false,
  },
  {
    type: "link",
    title: "Boîte de réception",
    url: routes.inbox.all,
    icon: IconInbox,
    moduleCode: moduleCodes.inbox,
    isReady: false,
  },
  {
    type: "link",
    title: "Clients",
    url: routes.customers.all,
    icon: IconUserHeart,
    moduleCode: moduleCodes.customers,
    isReady: false,
  },
  {
    type: "link",
    title: "Approbations",
    url: routes.approvals.all,
    icon: IconChecklist,
    moduleCode: moduleCodes.approvals,
    isReady: false,
  },
  {
    type: "link",
    title: "Équipes",
    url: routes.teams.all,
    icon: IconUsersGroup,
    moduleCode: moduleCodes.teams,
    isReady: false,
  },
  {
    type: "link",
    title: "Statistiques",
    url: routes.statistics.all,
    icon: IconChartBar,
    moduleCode: moduleCodes.statistics,
    isReady: false,
  },
  {
    type: "link",
    title: "Paramètres",
    url: routes.settings.root,
    icon: IconSettings,
    moduleCode: moduleCodes.settings,
    isReady: false,
  },
  {
    type: "section",
    id: "platform-admin",
    title: "Administration plateforme",
  },

  {
    type: "link",
    title: "Employés",
    url: routes.board.employees,
    icon: IconUsers,
    moduleCode: moduleCodes.employees,
    isReady: true,
  },
  {
    type: "link",
    title: "Groupes",
    url: routes.board.groups.root,
    icon: IconUsersGroup,
    moduleCode: moduleCodes.groups,
    isReady: true,
  },
  {
    type: "link",
    title: "Utilisateurs",
    url: routes.board.users,
    icon: IconUser,
    moduleCode: moduleCodes.users,
    isReady: true,
  },

  {
    type: "link",
    title: "Rôles et permissions",
    url: routes.board.roles.root,
    icon: IconShieldLock,
    moduleCode: moduleCodes.roles,
    isReady: true,
  },

  {
    type: "link",
    title: "Configuration des groupes",
    url: routes.board.groupConfiguration.root,
    icon: IconCategory,
    moduleCode: moduleCodes.groupConfiguration,
    isReady: true,
  },
  {
    type: "link",
    title: "Configuration géographique",
    url: routes.board.configuration.root,
    icon: IconAdjustments,
    moduleCode: moduleCodes.configuration,
    isReady: true,
  },
  
] as const satisfies readonly NavigationItem[]

export function isNavigationLinkItem(
  item: NavigationItem
): item is NavigationLinkItem {
  return item.type === "link"
}

export function isModuleRouteAvailable(pathname: string) {
  const matchingItem = navigationItems.reduce<NavigationLinkItem | undefined>(
    (currentMatch, item) => {
      if (!isNavigationLinkItem(item)) {
        return currentMatch
      }

      const matchesPathname =
        pathname === item.url || pathname.startsWith(`${item.url}/`)

      if (!matchesPathname) {
        return currentMatch
      }

      if (!currentMatch || item.url.length > currentMatch.url.length) {
        return item
      }

      return currentMatch
    },
    undefined
  )

  return matchingItem?.isReady ?? true
}

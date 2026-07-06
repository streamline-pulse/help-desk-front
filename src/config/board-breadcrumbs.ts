import { configurationUi } from "@/config/configuration-ui"
import { groupDetailUi } from "@/config/group-ui"
import { routes } from "@/config/routes"

export type BreadcrumbItem = {
  label: string
  href?: string
}

const boardRoot: BreadcrumbItem = {
  label: "Help Desk",
  href: routes.board.root,
}

function withBoardRoot(items: BreadcrumbItem[]): BreadcrumbItem[] {
  return [boardRoot, ...items]
}

const groupSectionLabels: Record<string, string> = {
  roles: groupDetailUi.roles.title,
  membres: groupDetailUi.membres.title,
  invitations: groupDetailUi.invitations.title,
}

export function getBoardBreadcrumbs(
  pathname: string,
  options?: { groupName?: string }
): BreadcrumbItem[] {
  if (pathname === routes.board.root) {
    return withBoardRoot([{ label: "Vue d'ensemble" }])
  }

  if (pathname === routes.board.employees) {
    return withBoardRoot([{ label: "Employés" }])
  }

  if (pathname === routes.board.users) {
    return withBoardRoot([{ label: "Utilisateurs" }])
  }

  if (pathname === routes.board.groups.root) {
    return withBoardRoot([{ label: "Groupes" }])
  }

  const groupMatch = pathname.match(/^\/board\/groupes\/([^/]+)(?:\/([^/]+))?$/)
  if (groupMatch) {
    const [, groupId, section] = groupMatch
    const groupLabel = options?.groupName?.trim() || "Groupe"
    const crumbs: BreadcrumbItem[] = [
      { label: "Groupes", href: routes.board.groups.root },
      { label: groupLabel, href: routes.board.groups.roles(groupId) },
    ]

    if (section && groupSectionLabels[section]) {
      crumbs.push({ label: groupSectionLabels[section] })
    }

    return withBoardRoot(crumbs)
  }

  if (pathname === routes.board.roles.root) {
    return withBoardRoot([
      { label: "Rôles et permissions" },
      { label: configurationUi.roles.title },
    ])
  }

  const rolesResourceMatch = pathname.match(/^\/board\/roles\/([^/]+)$/)
  if (rolesResourceMatch) {
    const resource = rolesResourceMatch[1] as keyof typeof configurationUi
    const title = configurationUi[resource]?.title ?? resource
    return withBoardRoot([
      { label: "Rôles et permissions", href: routes.board.roles.root },
      { label: title },
    ])
  }

  if (pathname === routes.board.groupConfiguration.root) {
    return withBoardRoot([
      { label: "Configuration des groupes" },
      { label: configurationUi["group-types"].title },
    ])
  }

  const groupConfigMatch = pathname.match(
    /^\/board\/group-configuration\/([^/]+)$/
  )
  if (groupConfigMatch) {
    const resource = groupConfigMatch[1] as keyof typeof configurationUi
    const title = configurationUi[resource]?.title ?? resource
    return withBoardRoot([
      {
        label: "Configuration des groupes",
        href: routes.board.groupConfiguration.resource("group-types"),
      },
      { label: title },
    ])
  }

  if (pathname === routes.board.configuration.root) {
    return withBoardRoot([
      { label: "Configuration géographique" },
      { label: configurationUi.countries.title },
    ])
  }

  const configMatch = pathname.match(/^\/board\/configuration\/([^/]+)$/)
  if (configMatch) {
    const resource = configMatch[1] as keyof typeof configurationUi
    const title = configurationUi[resource]?.title ?? resource
    return withBoardRoot([
      {
        label: "Configuration géographique",
        href: routes.board.configuration.resource("countries"),
      },
      { label: title },
    ])
  }

  if (pathname.startsWith(routes.board.root)) {
    return withBoardRoot([{ label: "Board" }])
  }

  return [{ label: "Help Desk" }]
}

export function getGroupIdFromPathname(pathname: string) {
  return pathname.match(/^\/board\/groupes\/([^/]+)/)?.[1]
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { BoardSearchCommand } from "@/components/board-search-command"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Kbd } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { routes } from "@/config/routes"
import { useAuth } from "@/hooks/use-auth"
import {
  IconChevronDown,
  IconDots,
  IconLayoutSidebar,
  IconLink,
  IconSearch,
  IconStar,
} from "@tabler/icons-react"

const boardBreadcrumbs: Record<string, { label: string; href?: string }[]> = {
  [routes.board.root]: [
    { label: "Help Desk", href: routes.board.root },
    { label: "Board" },
  ],
  [routes.board.employees]: [
    { label: "Help Desk", href: routes.board.root },
    { label: "Board", href: routes.board.root },
    { label: "Employees" },
  ],
}

function getBreadcrumbs(pathname: string) {
  if (boardBreadcrumbs[pathname]) {
    return boardBreadcrumbs[pathname]
  }

  return [
    { label: "Help Desk", href: routes.board.root },
    { label: "Board", href: routes.board.root },
  ]
}

function getInitials(email: string | undefined) {
  if (!email) {
    return "KR"
  }

  const localPart = email.split("@")[0] ?? ""
  const parts = localPart.split(/[._-]/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
  }

  return localPart.slice(0, 2).toUpperCase() || "KR"
}

export function SiteHeader() {
  const pathname = usePathname()
  const { toggleSidebar } = useSidebar()
  const { session } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const breadcrumbs = getBreadcrumbs(pathname)
  const isEmployeesPage = pathname === routes.board.employees
  const initials = getInitials(session?.email)

  return (
    <>
      <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
        <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
          <Button
            className="size-8"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <IconLayoutSidebar />
          </Button>
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb className="hidden min-w-0 sm:block">
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1

                return (
                  <span key={crumb.label} className="contents">
                    <BreadcrumbItem>
                      {isLast || !crumb.href ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink render={<Link href={crumb.href} />}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast ? <BreadcrumbSeparator /> : null}
                  </span>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden h-8 gap-2 text-muted-foreground md:inline-flex"
              onClick={() => setSearchOpen(true)}
            >
              <IconSearch data-icon="inline-start" />
              Search
              <Kbd className="bg-transparent">⌘K</Kbd>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-8 text-muted-foreground md:hidden"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <IconSearch />
            </Button>

            {isEmployeesPage ? (
              <>
                <span className="hidden text-[13px] text-neutral-400 lg:inline">
                  Edited 23 min ago
                </span>
                <Button
                  size="sm"
                  className="h-7 gap-1.5 rounded-md bg-neutral-900 px-3 text-[13px] font-medium text-white hover:bg-neutral-800"
                >
                  <IconLink data-icon="inline-start" />
                  Share
                  <IconChevronDown data-icon="inline-end" />
                </Button>
                <Avatar size="sm" className="size-7">
                  <AvatarFallback className="bg-sky-100 text-[11px] font-medium text-sky-700">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-7 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                  aria-label="Favorite"
                >
                  <IconStar />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-7 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                  aria-label="More options"
                >
                  <IconDots />
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <BoardSearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}

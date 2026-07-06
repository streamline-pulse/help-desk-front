"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"

import { BoardSearchCommand } from "@/components/shared/navigation/board-search-command"
import {
  getBoardBreadcrumbs,
  getGroupIdFromPathname,
} from "@/config/board-breadcrumbs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { routes } from "@/config/routes"
import { useGroupQuery } from "@/hooks/queries/use-group.query"
import {
  IconChevronDown,
  IconClock,
  IconCopy,
  IconDots,
  IconLayoutDashboard,
  IconLayoutSidebar,
  IconLink,
  IconRefresh,
  IconSearch,
  IconStar,
} from "@tabler/icons-react"

function getBreadcrumbs(pathname: string, groupName?: string) {
  return getBoardBreadcrumbs(pathname, { groupName })
}

function DigitalClock() {
  const [time, setTime] = useState("--:--")

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    const updateTime = () => setTime(formatter.format(new Date()))

    updateTime()
    const intervalId = window.setInterval(updateTime, 30_000)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <span
      className="hidden h-7 items-center gap-1.5 px-1 text-sm font-medium text-muted-foreground tabular-nums lg:inline-flex"
      aria-label={`Heure actuelle : ${time}`}
    >
      <IconClock className="size-4" aria-hidden="true" />
      <time>{time}</time>
    </span>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { toggleSidebar } = useSidebar()
  const [searchOpen, setSearchOpen] = useState(false)
  const groupId = getGroupIdFromPathname(pathname)
  const groupQuery = useGroupQuery(groupId ?? "")
  const breadcrumbs = getBreadcrumbs(pathname, groupQuery.data?.name)
  const isEmployeesPage = pathname === routes.board.employees

  async function handleCopyPageLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Lien de la page copié")
    } catch {
      toast.error("Impossible de copier le lien")
    }
  }

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
                  <span
                    key={`${crumb.label}-${index}`}
                    className="contents"
                  >
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
              variant="secondary"
              className="hidden w-64 justify-start text-muted-foreground lg:inline-flex"
              onClick={() => setSearchOpen(true)}
            >
              <IconSearch data-icon="inline-start" />
              <span className="truncate">Rechercher</span>
              <Kbd className="ml-auto bg-background/60">⌘K</Kbd>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-8 text-muted-foreground lg:hidden"
              aria-label="Rechercher"
              onClick={() => setSearchOpen(true)}
            >
              <IconSearch />
            </Button>

            {isEmployeesPage ? (
              <>
                <DigitalClock />
                <Button
                  size="sm"
                  className="h-7 gap-1.5 rounded-md bg-neutral-900 px-3 text-[13px] font-medium text-white hover:bg-neutral-800"
                >
                  <IconLink data-icon="inline-start" />
                  Partager
                  <IconChevronDown data-icon="inline-end" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-7 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                  aria-label="Ajouter aux favoris"
                >
                  <IconStar />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="size-7 text-muted-foreground"
                        aria-label="Plus d’options"
                      />
                    }
                  >
                    <IconDots />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem onClick={() => router.refresh()}>
                      <IconRefresh />
                      Actualiser la page
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopyPageLink}>
                      <IconCopy />
                      Copier le lien
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => router.push(routes.board.root)}
                    >
                      <IconLayoutDashboard />
                      Vue d’ensemble
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <BoardSearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}

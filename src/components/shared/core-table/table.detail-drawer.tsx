"use client"

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

import {
  TableRowActionsButtons,
  type TableRowAction,
} from "@/components/shared/core-table/cells/actions.cell"
import {
  TableDetailDepthProvider,
  useTableDetailDepth,
} from "@/components/shared/core-table/table.detail.provider"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export type TableDetailDrawerSize = "sm" | "md" | "lg" | "xl" | "2xl"

export type TableDetailDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  actions?: TableRowAction[]
  footer?: ReactNode
  nested?: boolean
  modal?: boolean
  showHandle?: boolean
  preventClose?: boolean
  size?: TableDetailDrawerSize
  contentClassName?: string
  bodyClassName?: string
}

const sizeClassNames: Record<TableDetailDrawerSize, string> = {
  sm: "sm:[--drawer-content-width:24rem]",
  md: "sm:[--drawer-content-width:28rem]",
  lg: "sm:[--drawer-content-width:32rem]",
  xl: "sm:[--drawer-content-width:36rem]",
  "2xl": "sm:[--drawer-content-width:42rem]",
}

const drawerSurfaceClassName =
  "[--drawer-inset:0.75rem] [--bleed:0px] after:hidden rounded-xl! border!"

function DrawerScrollBody({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showBottomFade, setShowBottomFade] = useState(false)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    function updateFade() {
      const node = scrollRef.current
      if (!node) return

      const hasScroll = node.scrollHeight > node.clientHeight + 1
      const atBottom =
        node.scrollHeight - node.scrollTop - node.clientHeight < 8
      setShowBottomFade(hasScroll && !atBottom)
    }

    updateFade()

    element.addEventListener("scroll", updateFade, { passive: true })
    const resizeObserver = new ResizeObserver(updateFade)
    resizeObserver.observe(element)

    return () => {
      element.removeEventListener("scroll", updateFade)
      resizeObserver.disconnect()
    }
  }, [children])

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollRef}
        className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-4", className)}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-popover to-transparent transition-opacity duration-200",
          showBottomFade ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  )
}

function TableDetailDrawerContent({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions,
  footer,
  nested = false,
  modal = true,
  showHandle = true,
  preventClose = false,
  size = "lg",
  contentClassName,
  bodyClassName,
}: TableDetailDrawerProps) {
  const isMobile = useIsMobile()
  const depth = useTableDetailDepth()
  const nextDepth = nested ? depth + 1 : depth
  const visibleActions = actions?.filter((action) => !action.hidden) ?? []
  const hasFooter = visibleActions.length > 0 || Boolean(footer)

  function handleOpenChange(next: boolean) {
    if (next) {
      onOpenChange(true)
      return
    }
    if (!preventClose) onOpenChange(false)
  }

  return (
    <TableDetailDepthProvider depth={nextDepth}>
      <Drawer
        open={open}
        onOpenChange={handleOpenChange}
        modal={modal}
        showSwipeHandle={showHandle}
        swipeDirection={isMobile ? "down" : "right"}
      >
        <DrawerContent
          data-slot="table-detail-drawer-content"
          className={cn(
            drawerSurfaceClassName,
            sizeClassNames[size],
            contentClassName
          )}
        >
          <DrawerHeader className="px-5 pt-5 pb-2 text-left">
            <DrawerTitle>{title}</DrawerTitle>
            {description ? (
              <DrawerDescription>{description}</DrawerDescription>
            ) : null}
          </DrawerHeader>
          <DrawerScrollBody className={bodyClassName}>
            {children}
          </DrawerScrollBody>
          {hasFooter ? (
            <DrawerFooter className="flex-row items-center justify-end gap-2 px-5 pt-2 pb-5">
              {visibleActions.length > 0 ? (
                <TableRowActionsButtons actions={visibleActions} size="md" />
              ) : null}
              {footer}
            </DrawerFooter>
          ) : null}
        </DrawerContent>
      </Drawer>
    </TableDetailDepthProvider>
  )
}

export function TableDetailDrawer(props: TableDetailDrawerProps) {
  return <TableDetailDrawerContent {...props} />
}

export { DrawerClose as TableDetailDrawerClose } from "@/components/ui/drawer"

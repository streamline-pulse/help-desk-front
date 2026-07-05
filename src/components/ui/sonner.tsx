"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  IconAlertOctagon,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconLoader,
} from "@tabler/icons-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <IconCircleCheck className="size-4 text-emerald-600" />,
        info: <IconInfoCircle className="size-4 text-blue-600" />,
        warning: <IconAlertTriangle className="size-4 text-amber-600" />,
        error: <IconAlertOctagon className="size-4 text-destructive" />,
        loading: <IconLoader className="size-4 animate-spin text-primary" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          success: "!border-emerald-500/60",
          error: "!border-destructive/60",
          loading: "!border-primary/60",
          info: "!border-blue-500/60",
          warning: "!border-amber-500/60",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

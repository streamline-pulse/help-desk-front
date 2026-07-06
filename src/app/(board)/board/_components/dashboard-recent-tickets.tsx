import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { RecentTicket } from "@/config/dashboard-mock"
import { cn } from "@/lib/utils"

const statusVariants: Record<
  RecentTicket["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  Nouveau: "default",
  "En cours": "secondary",
  "En attente": "outline",
  Résolu: "outline",
}

const priorityClassNames: Record<RecentTicket["priority"], string> = {
  Basse: "text-muted-foreground",
  Normale: "text-foreground",
  Haute: "text-primary",
  Critique: "text-destructive",
}

type DashboardRecentTicketsProps = {
  tickets: RecentTicket[]
}

export function DashboardRecentTickets({ tickets }: DashboardRecentTicketsProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Activité récente</CardTitle>
        <CardDescription>
          Dernières demandes mises à jour dans la file
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pt-0">
        <ul className="divide-y divide-border">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="flex flex-col gap-2 px-(--card-spacing) py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {ticket.reference}
                  </span>
                  <Badge variant={statusVariants[ticket.status]}>
                    {ticket.status}
                  </Badge>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      priorityClassNames[ticket.priority]
                    )}
                  >
                    {ticket.priority}
                  </span>
                </div>
                <p className="mt-1 truncate font-medium">{ticket.subject}</p>
                <p className="text-sm text-muted-foreground">{ticket.client}</p>
              </div>
              <p className="shrink-0 text-xs text-muted-foreground tabular-nums sm:text-right">
                {ticket.updatedAt}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

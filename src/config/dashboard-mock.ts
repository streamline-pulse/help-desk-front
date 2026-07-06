export type DashboardTrend = "up" | "down" | "neutral"

export type DashboardKpi = {
  id: string
  label: string
  value: string
  change: string
  changeLabel: string
  trend: DashboardTrend
  intent: "positive" | "negative" | "neutral"
}

export type WeeklyVolumePoint = {
  day: string
  opened: number
  resolved: number
}

export type StatusVolumePoint = {
  status: string
  count: number
  fill: string
}

export type PrioritySharePoint = {
  priority: string
  count: number
  fill: string
}

export type RecentTicket = {
  id: string
  reference: string
  subject: string
  client: string
  status: "Nouveau" | "En cours" | "En attente" | "Résolu"
  priority: "Basse" | "Normale" | "Haute" | "Critique"
  updatedAt: string
}

export type AgentWorkloadPoint = {
  agent: string
  open: number
  resolved: number
}

export const dashboardKpis: DashboardKpi[] = [
  {
    id: "open-requests",
    label: "Demandes ouvertes",
    value: "47",
    change: "+12 %",
    changeLabel: "vs semaine dernière",
    trend: "up",
    intent: "negative",
  },
  {
    id: "resolved-month",
    label: "Résolues ce mois",
    value: "312",
    change: "+8 %",
    changeLabel: "vs mois précédent",
    trend: "up",
    intent: "positive",
  },
  {
    id: "first-response",
    label: "Temps moyen 1ʳᵉ réponse",
    value: "2 h 14",
    change: "−18 %",
    changeLabel: "vs mois précédent",
    trend: "down",
    intent: "positive",
  },
  {
    id: "satisfaction",
    label: "Satisfaction client",
    value: "94 %",
    change: "+2 pts",
    changeLabel: "sur 30 jours",
    trend: "up",
    intent: "positive",
  },
]

export const weeklyVolume: WeeklyVolumePoint[] = [
  { day: "Lun", opened: 38, resolved: 31 },
  { day: "Mar", opened: 42, resolved: 36 },
  { day: "Mer", opened: 35, resolved: 40 },
  { day: "Jeu", opened: 48, resolved: 44 },
  { day: "Ven", opened: 52, resolved: 49 },
  { day: "Sam", opened: 18, resolved: 22 },
  { day: "Dim", opened: 12, resolved: 15 },
]

export const statusVolume: StatusVolumePoint[] = [
  { status: "Nouveau", count: 14, fill: "var(--chart-1)" },
  { status: "En cours", count: 22, fill: "var(--chart-2)" },
  { status: "En attente", count: 11, fill: "var(--chart-3)" },
  { status: "Résolu", count: 48, fill: "var(--chart-4)" },
  { status: "Fermé", count: 36, fill: "var(--chart-5)" },
]

export const priorityShare: PrioritySharePoint[] = [
  { priority: "Basse", count: 28, fill: "var(--chart-4)" },
  { priority: "Normale", count: 54, fill: "var(--chart-2)" },
  { priority: "Haute", count: 31, fill: "var(--chart-3)" },
  { priority: "Critique", count: 9, fill: "var(--chart-1)" },
]

export const agentWorkload: AgentWorkloadPoint[] = [
  { agent: "Marie D.", open: 12, resolved: 38 },
  { agent: "Thomas L.", open: 9, resolved: 41 },
  { agent: "Amina K.", open: 8, resolved: 35 },
  { agent: "Lucas P.", open: 7, resolved: 29 },
  { agent: "Sophie R.", open: 6, resolved: 33 },
]

export const recentTickets: RecentTicket[] = [
  {
    id: "1",
    reference: "DEM-1042",
    subject: "Accès portail client bloqué",
    client: "Société Atlas",
    status: "En cours",
    priority: "Haute",
    updatedAt: "Il y a 12 min",
  },
  {
    id: "2",
    reference: "DEM-1041",
    subject: "Facture manquante — mars 2026",
    client: "Groupe Horizon",
    status: "Nouveau",
    priority: "Normale",
    updatedAt: "Il y a 34 min",
  },
  {
    id: "3",
    reference: "DEM-1039",
    subject: "Demande de réinitialisation MFA",
    client: "Clinique Nord",
    status: "En attente",
    priority: "Critique",
    updatedAt: "Il y a 1 h",
  },
  {
    id: "4",
    reference: "DEM-1036",
    subject: "Export CSV des utilisateurs",
    client: "Mutuelle Est",
    status: "Résolu",
    priority: "Basse",
    updatedAt: "Il y a 2 h",
  },
  {
    id: "5",
    reference: "DEM-1034",
    subject: "Erreur 500 sur le formulaire contact",
    client: "Retail Plus",
    status: "En cours",
    priority: "Haute",
    updatedAt: "Il y a 3 h",
  },
]

export const slaCompliance = {
  label: "Respect des SLA",
  value: 87,
  target: 90,
  description: "Première réponse dans le délai contractuel",
}

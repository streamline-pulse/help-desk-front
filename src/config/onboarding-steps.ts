import { moduleCodes, type ModuleCode } from "@/config/navigation-items"
import { routes } from "@/config/routes"
import { onboardingEvents } from "@/lib/onboarding-events"

export const onboardingStepIds = {
  exploreNavigation: "explore-navigation",
  globalSearch: "global-search",
  tableSearch: "table-search",
  exportData: "export-data",
  createUser: "create-user",
} as const

export type OnboardingStepId =
  (typeof onboardingStepIds)[keyof typeof onboardingStepIds]

export type OnboardingCompleteOn = "visit" | "action"

export type OnboardingStepDefinition = {
  id: OnboardingStepId
  title: string
  description: string
  route: string
  target: string
  completeOn: OnboardingCompleteOn
  actionEvent?: string
  requires?: {
    moduleName: string
    permission: string
  }
  moduleCode?: ModuleCode
  previewId: OnboardingStepId
  side?: "top" | "bottom" | "left" | "right"
  checklistHint?: string
}

export const onboardingSteps: readonly OnboardingStepDefinition[] = [
  {
    id: onboardingStepIds.exploreNavigation,
    title: "Explorer les modules",
    description:
      "La barre latérale regroupe les espaces de travail. Cliquez sur un module pour y accéder.",
    route: routes.board.root,
    target: "sidebar-navigation",
    completeOn: "visit",
    previewId: onboardingStepIds.exploreNavigation,
    side: "right",
    checklistHint: "Ouvrir un module depuis la barre latérale",
  },
  {
    id: onboardingStepIds.globalSearch,
    title: "Recherche rapide",
    description:
      "Retrouvez une page ou une ressource en un raccourci clavier, sans parcourir les menus.",
    route: routes.board.root,
    target: "global-search",
    completeOn: "action",
    actionEvent: onboardingEvents.searchOpened,
    previewId: onboardingStepIds.globalSearch,
    side: "bottom",
    checklistHint: "Ouvrir la recherche (⌘K)",
  },
  {
    id: onboardingStepIds.tableSearch,
    title: "Filtrer la liste",
    description:
      "Affinez les résultats avec la recherche. Elle s’applique à toute la collection côté serveur.",
    route: routes.board.users,
    target: "table-search",
    completeOn: "action",
    actionEvent: onboardingEvents.tableSearchUsed,
    requires: { moduleName: moduleCodes.users, permission: "read" },
    moduleCode: moduleCodes.users,
    previewId: onboardingStepIds.tableSearch,
    side: "bottom",
    checklistHint: "Rechercher dans le tableau",
  },
  {
    id: onboardingStepIds.exportData,
    title: "Exporter les données",
    description:
      "Téléchargez un fichier CSV des lignes visibles ou de votre sélection.",
    route: routes.board.users,
    target: "table-export",
    completeOn: "action",
    actionEvent: onboardingEvents.exportCompleted,
    requires: { moduleName: moduleCodes.users, permission: "read" },
    moduleCode: moduleCodes.users,
    previewId: onboardingStepIds.exportData,
    side: "bottom",
    checklistHint: "Exporter le tableau",
  },
  {
    id: onboardingStepIds.createUser,
    title: "Ajouter un utilisateur",
    description:
      "Créez un compte, assignez un rôle et définissez les accès depuis ce bouton.",
    route: routes.board.users,
    target: "create-user",
    completeOn: "action",
    actionEvent: onboardingEvents.userCreated,
    requires: { moduleName: moduleCodes.users, permission: "create" },
    moduleCode: moduleCodes.users,
    previewId: onboardingStepIds.createUser,
    side: "bottom",
    checklistHint: "Créer un utilisateur",
  },
] as const

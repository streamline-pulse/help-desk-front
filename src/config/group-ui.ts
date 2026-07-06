import type { TablerIcon } from "@tabler/icons-react"
import {
  IconFiles,
  IconMailPlus,
  IconShield,
  IconUsers,
} from "@tabler/icons-react"

export const groupDetailMenuResources = [
  "roles",
  "membres",
  "invitations",
  "fichiers",
] as const

export type GroupDetailResource =
  (typeof groupDetailMenuResources)[number]

export const groupDetailUi: Record<
  GroupDetailResource,
  { title: string; description: string; icon: TablerIcon }
> = {
  roles: {
    title: "Rôles",
    description:
      "Définissez les permissions utilisées par les membres et les invitations.",
    icon: IconShield,
  },
  membres: {
    title: "Membres",
    description:
      "Affectez les utilisateurs existants et leur rôle dans ce groupe.",
    icon: IconUsers,
  },
  invitations: {
    title: "Invitations",
    description:
      "Invitez par e-mail ou générez un lien à partager manuellement.",
    icon: IconMailPlus,
  },
  fichiers: {
    title: "Fichiers",
    description:
      "Centralisez les documents et pièces jointes utiles à ce groupe.",
    icon: IconFiles,
  },
}

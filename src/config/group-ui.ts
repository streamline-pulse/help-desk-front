export const groupDetailMenuResources = [
  "roles",
  "membres",
  "invitations",
] as const

export type GroupDetailResource =
  (typeof groupDetailMenuResources)[number]

export const groupDetailUi: Record<
  GroupDetailResource,
  { title: string; description: string }
> = {
  roles: {
    title: "Rôles",
    description:
      "Définissez les permissions utilisées par les membres et les invitations.",
  },
  membres: {
    title: "Membres",
    description:
      "Affectez les utilisateurs existants et leur rôle dans ce groupe.",
  },
  invitations: {
    title: "Invitations",
    description:
      "Invitez par e-mail ou générez un lien à partager manuellement.",
  },
}

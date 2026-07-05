import type { ConfigurationResource } from "@/types/configuration-resource.type"

export type ConfigurationField = {
  name: "name" | "language" | "label" | "countrySlug" | "regionSlug"
  label: string
  placeholder: string
  type?: "text" | "select"
  optionsResource?: ConfigurationResource
}

export const configurationUi = {
  languages: {
    title: "Langues",
    singular: "langue",
    description:
      "Langues disponibles sur la plateforme, avec un libellé affiché et un code technique pour l’API.",
    fields: [
      { name: "name", label: "Nom affiché", placeholder: "Français" },
      { name: "language", label: "Code langue", placeholder: "fr" },
    ],
  },
  countries: {
    title: "Pays",
    singular: "pays",
    description:
      "Pays pris en charge par la plateforme, base de la hiérarchie géographique pour régions, villes et groupes.",
    fields: [{ name: "name", label: "Nom du pays", placeholder: "Togo" }],
  },
  regions: {
    title: "Régions",
    singular: "région",
    description:
      "Découpage administratif rattaché à un pays, regroupant les villes et structurant la localisation des groupes.",
    fields: [
      { name: "name", label: "Nom de la région", placeholder: "Maritime" },
      {
        name: "countrySlug",
        label: "Pays de rattachement",
        placeholder: "Sélectionner le pays associé",
        type: "select",
        optionsResource: "countries",
      },
    ],
  },
  towns: {
    title: "Villes",
    singular: "ville",
    description:
      "Villes rattachées à une région, utilisées pour affiner la localisation des groupes sur la plateforme.",
    fields: [
      { name: "name", label: "Nom de la ville", placeholder: "Lomé" },
      {
        name: "regionSlug",
        label: "Région de rattachement",
        placeholder: "Sélectionner la région associée",
        type: "select",
        optionsResource: "regions",
      },
    ],
  },
  modules: {
    title: "Modules",
    singular: "module",
    description:
      "Domaines fonctionnels de l’application auxquels s’appliquent les permissions et les contrôles d’accès.",
    fields: [
      { name: "label", label: "Libellé affiché", placeholder: "Utilisateurs" },
      { name: "name", label: "Code technique", placeholder: "USERS" },
    ],
  },
  permissions: {
    title: "Permissions",
    singular: "permission",
    description:
      "Actions autorisées sur la plateforme, combinées dans les rôles pour définir les droits effectifs.",
    fields: [
      { name: "label", label: "Libellé affiché", placeholder: "Créer" },
      { name: "name", label: "Code technique", placeholder: "CREATE" },
    ],
  },
  roles: {
    title: "Rôles",
    singular: "rôle",
    description:
      "Profils d’accès regroupant des permissions par module pour définir ce que chaque utilisateur peut faire.",
    fields: [
      { name: "name", label: "Nom du rôle", placeholder: "Administrateur" },
    ],
  },
  "group-types": {
    title: "Types",
    singular: "type de groupe",
    description:
      "Catégories servant à classer les groupes selon leur nature, comme une entreprise ou une équipe.",
    fields: [
      { name: "name", label: "Nom du type", placeholder: "Organisation" },
    ],
  },
  "group-modules": {
    title: "Modules",
    singular: "module de groupe",
    description:
      "Fonctionnalités disponibles dans un groupe, base des permissions internes accordées à ses membres.",
    fields: [
      { name: "label", label: "Libellé affiché", placeholder: "Membres" },
      { name: "name", label: "Code technique", placeholder: "MEMBERS" },
    ],
  },
  "group-permissions": {
    title: "Permissions",
    singular: "permission de groupe",
    description:
      "Actions autorisées au sein d’un groupe, associées ensuite aux rôles internes de chaque groupe.",
    fields: [
      { name: "label", label: "Libellé affiché", placeholder: "Inviter" },
      { name: "name", label: "Code technique", placeholder: "INVITE" },
    ],
  },
} as const satisfies Record<
  ConfigurationResource,
  {
    title: string
    singular: string
    description: string
    fields: readonly ConfigurationField[]
  }
>

export const configurationMenuResources = [
  "countries",
  "regions",
  "towns",
] as const satisfies readonly ConfigurationResource[]

export const accessControlMenuResources = [
  "roles",
  "modules",
  "permissions",
] as const satisfies readonly ConfigurationResource[]

export const groupConfigurationMenuResources = [
  "group-types",
  "group-modules",
  "group-permissions",
] as const satisfies readonly ConfigurationResource[]

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
    description: "Gérez les langues proposées dans les référentiels.",
    fields: [
      { name: "name", label: "Nom", placeholder: "Français" },
      { name: "language", label: "Code", placeholder: "fr" },
    ],
  },
  countries: {
    title: "Pays",
    singular: "pays",
    description:
      "Définissez les pays utilisés pour la localisation des groupes.",
    fields: [{ name: "name", label: "Nom", placeholder: "Togo" }],
  },
  regions: {
    title: "Régions",
    singular: "région",
    description: "Rattachez chaque région à son pays de référence.",
    fields: [
      { name: "name", label: "Nom", placeholder: "Maritime" },
      {
        name: "countrySlug",
        label: "Pays",
        placeholder: "Sélectionner un pays",
        type: "select",
        optionsResource: "countries",
      },
    ],
  },
  towns: {
    title: "Villes",
    singular: "ville",
    description: "Rattachez chaque ville à sa région de référence.",
    fields: [
      { name: "name", label: "Nom", placeholder: "Lomé" },
      {
        name: "regionSlug",
        label: "Région",
        placeholder: "Sélectionner une région",
        type: "select",
        optionsResource: "regions",
      },
    ],
  },
  modules: {
    title: "Modules",
    singular: "module",
    description:
      "Déclarez les domaines fonctionnels auxquels les droits s’appliquent.",
    fields: [
      { name: "label", label: "Libellé", placeholder: "Utilisateurs" },
      { name: "name", label: "Code", placeholder: "USERS" },
    ],
  },
  permissions: {
    title: "Permissions",
    singular: "permission",
    description:
      "Définissez les actions disponibles dans les différents modules.",
    fields: [
      { name: "label", label: "Libellé", placeholder: "Créer" },
      { name: "name", label: "Code", placeholder: "CREATE" },
    ],
  },
  roles: {
    title: "Rôles",
    singular: "rôle",
    description: "Composez les droits attribués aux utilisateurs par module.",
    fields: [{ name: "name", label: "Nom", placeholder: "Administrateur" }],
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
  "languages",
  "countries",
  "regions",
  "towns",
] as const satisfies readonly ConfigurationResource[]

export const accessControlMenuResources = [
  "roles",
  "modules",
  "permissions",
] as const satisfies readonly ConfigurationResource[]

import { useQuery, useQueryClient } from "@tanstack/react-query"

import { useApiMutation } from "@/hooks/use-api-mutation"
import type {
  GroupCapabilityInput,
  GroupTypeInput,
} from "@/schemas/group-configuration.schema"
import {
  groupModuleService,
  groupPermissionService,
  groupTypeService,
} from "@/services/group-configuration.service"
import type { ApiListParams } from "@/types/api/api-data.type"

type Resource = "group-types" | "group-modules" | "group-permissions"
type Input = GroupTypeInput | GroupCapabilityInput
const services = {
  "group-types": groupTypeService,
  "group-modules": groupModuleService,
  "group-permissions": groupPermissionService,
}
const labels = {
  "group-types": "type de groupe",
  "group-modules": "module de groupe",
  "group-permissions": "permission de groupe",
}
const keys = {
  all: (resource: Resource) => ["group-configuration", resource] as const,
  list: (resource: Resource, request: ApiListParams) =>
    ["group-configuration", resource, "list", request] as const,
}

export function createGroupConfigurationHooks(resource: Resource) {
  const service = services[resource]
  const label = labels[resource]
  return {
    useList(request: ApiListParams) {
      return useQuery({
        queryKey: keys.list(resource, request),
        queryFn: ({ signal }) => service.list(request, signal),
        placeholderData: (previous) => previous,
      })
    },
    useCreate() {
      const client = useQueryClient()
      return useApiMutation(
        {
          mutationFn: (input: Input) => service.create(input as never),
          onSuccess: () =>
            client.invalidateQueries({ queryKey: keys.all(resource) }),
        },
        {
          loading: `Création du ${label}…`,
          success: `Le ${label} a été créé.`,
          error: `Impossible de créer le ${label}.`,
        }
      )
    },
    useUpdate() {
      const client = useQueryClient()
      return useApiMutation(
        {
          mutationFn: ({
            identifier,
            input,
          }: {
            identifier: string
            input: Partial<Input>
          }) => service.update(identifier, input as never),
          onSuccess: () =>
            client.invalidateQueries({ queryKey: keys.all(resource) }),
        },
        {
          loading: `Mise à jour du ${label}…`,
          success: `Le ${label} a été mis à jour.`,
          error: `Impossible de mettre à jour le ${label}.`,
        }
      )
    },
    useDelete() {
      const client = useQueryClient()
      return useApiMutation(
        {
          mutationFn: service.remove,
          onSuccess: () =>
            client.invalidateQueries({ queryKey: keys.all(resource) }),
        },
        {
          loading: `Suppression du ${label}…`,
          success: `Le ${label} a été supprimé.`,
          error: `Impossible de supprimer le ${label}.`,
        }
      )
    },
    useBulkDelete() {
      const client = useQueryClient()
      return useApiMutation(
        {
          mutationFn: (ids: string[]) => Promise.all(ids.map(service.remove)),
          onSuccess: () =>
            client.invalidateQueries({ queryKey: keys.all(resource) }),
        },
        {
          loading: `Suppression des éléments…`,
          success: "Les éléments ont été supprimés.",
          error: "Impossible de supprimer les éléments.",
        }
      )
    },
  }
}

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useApiMutation } from "@/hooks/use-api-mutation"
import type { RoleInput } from "@/schemas/role.schema"
import { roleService } from "@/services/role.service"
import type { ApiListParams } from "@/types/api/api-data.type"

const keys = {
  all: ["configuration", "roles"] as const,
  list: (request: ApiListParams) =>
    ["configuration", "roles", "list", request] as const,
}

export function useRoleListQuery(request: ApiListParams, enabled = true) {
  return useQuery({
    queryKey: keys.list(request),
    queryFn: ({ signal }) => roleService.list(request, signal),
    placeholderData: (previous) => previous,
    enabled,
  })
}
export function useCreateRoleMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: roleService.create,
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Création du rôle…",
      success: "Le rôle a été créé.",
      error: "Impossible de créer le rôle.",
    }
  )
}
export function useUpdateRoleMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: ({
        identifier,
        input,
      }: {
        identifier: string
        input: Partial<RoleInput>
      }) => roleService.update(identifier, input),
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Mise à jour du rôle…",
      success: "Le rôle a été mis à jour.",
      error: "Impossible de mettre à jour le rôle.",
    }
  )
}
export function useDeleteRoleMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: roleService.remove,
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Suppression du rôle…",
      success: "Le rôle a été supprimé.",
      error: "Impossible de supprimer le rôle.",
    }
  )
}
export function useBulkDeleteRolesMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: (ids: string[]) => Promise.all(ids.map(roleService.remove)),
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Suppression des rôles…",
      success: "Les rôles sélectionnés ont été supprimés.",
      error: "Impossible de supprimer les rôles sélectionnés.",
    }
  )
}

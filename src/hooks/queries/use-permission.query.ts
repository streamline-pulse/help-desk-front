import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useApiMutation } from "@/hooks/use-api-mutation"
import type { PermissionInput } from "@/schemas/permission.schema"
import { permissionService } from "@/services/permission.service"
import type { ApiListParams } from "@/types/api/api-data.type"

const keys = {
  all: ["configuration", "permissions"] as const,
  list: (request: ApiListParams) =>
    ["configuration", "permissions", "list", request] as const,
}

export function usePermissionListQuery(request: ApiListParams, enabled = true) {
  return useQuery({
    queryKey: keys.list(request),
    queryFn: ({ signal }) => permissionService.list(request, signal),
    placeholderData: (previous) => previous,
    enabled,
  })
}
export function useCreatePermissionMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: permissionService.create,
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Création de la permission…",
      success: "La permission a été créée.",
      error: "Impossible de créer la permission.",
    }
  )
}
export function useUpdatePermissionMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: ({
        identifier,
        input,
      }: {
        identifier: string
        input: Partial<PermissionInput>
      }) => permissionService.update(identifier, input),
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Mise à jour de la permission…",
      success: "La permission a été mise à jour.",
      error: "Impossible de mettre à jour la permission.",
    }
  )
}
export function useDeletePermissionMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: permissionService.remove,
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Suppression de la permission…",
      success: "La permission a été supprimée.",
      error: "Impossible de supprimer la permission.",
    }
  )
}
export function useBulkDeletePermissionsMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: (ids: string[]) =>
        Promise.all(ids.map(permissionService.remove)),
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Suppression des permissions…",
      success: "Les permissions sélectionnées ont été supprimées.",
      error: "Impossible de supprimer les permissions sélectionnées.",
    }
  )
}

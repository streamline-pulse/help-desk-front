import { useQuery, useQueryClient } from "@tanstack/react-query"

import { useApiMutation } from "@/hooks/use-api-mutation"
import type { CreateUserInput, UpdateUserInput } from "@/schemas/user.schema"
import { userService } from "@/services/user.service"
import type { ApiListParams } from "@/types/api/api-data.type"

export const userQueryKeys = {
  all: ["users"] as const,
  list: (request: ApiListParams) => ["users", "list", request] as const,
  detail: (id: string) => ["users", "detail", id] as const,
}

export function useUserListQuery(request: ApiListParams) {
  return useQuery({
    queryKey: userQueryKeys.list(request),
    queryFn: ({ signal }) => userService.list(request, signal),
    placeholderData: (previous) => previous,
  })
}

export function useCreateUserMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: (input: CreateUserInput) => userService.create(input),
      onSuccess: () =>
        client.invalidateQueries({ queryKey: userQueryKeys.all }),
    },
    {
      loading: "Création de l’utilisateur…",
      success: "L’utilisateur a été créé.",
      error: "Impossible de créer l’utilisateur.",
    }
  )
}

export function useUpdateUserMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) =>
        userService.update(id, input),
      onSuccess: () =>
        client.invalidateQueries({ queryKey: userQueryKeys.all }),
    },
    {
      loading: "Mise à jour de l’utilisateur…",
      success: "L’utilisateur a été mis à jour.",
      error: "Impossible de mettre à jour l’utilisateur.",
    }
  )
}

export function useDeleteUserMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: userService.remove,
      onSuccess: () =>
        client.invalidateQueries({ queryKey: userQueryKeys.all }),
    },
    {
      loading: "Suppression de l’utilisateur…",
      success: "L’utilisateur a été supprimé.",
      error: "Impossible de supprimer l’utilisateur.",
    }
  )
}

export function useBulkDeleteUsersMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: (ids: string[]) => Promise.all(ids.map(userService.remove)),
      onSuccess: () =>
        client.invalidateQueries({ queryKey: userQueryKeys.all }),
    },
    {
      loading: "Suppression des utilisateurs…",
      success: "Les utilisateurs ont été supprimés.",
      error: "Impossible de supprimer les utilisateurs.",
    }
  )
}

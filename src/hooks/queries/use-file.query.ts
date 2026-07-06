import { useQuery, useQueryClient } from "@tanstack/react-query"

import { useApiMutation } from "@/hooks/use-api-mutation"
import { fileService } from "@/services/file.service"
import type { ApiListParams } from "@/types/api/api-data.type"

export const fileQueryKeys = {
  all: ["files"] as const,
  byGroup: (groupId: string) => [...fileQueryKeys.all, "group", groupId] as const,
  listByGroup: (groupId: string, request: ApiListParams) =>
    [...fileQueryKeys.byGroup(groupId), "list", request] as const,
  detail: (id: string) => [...fileQueryKeys.all, "detail", id] as const,
}

export function useGroupFileListQuery(
  groupId: string,
  request: ApiListParams,
  enabled = true
) {
  return useQuery({
    queryKey: fileQueryKeys.listByGroup(groupId, request),
    queryFn: ({ signal }) => fileService.listByGroup(groupId, request, signal),
    placeholderData: (previous) => previous,
    enabled: enabled && Boolean(groupId),
  })
}

export function useGroupFileQuery(groupId: string, id: string, enabled = true) {
  return useQuery({
    queryKey: fileQueryKeys.detail(id),
    queryFn: async ({ signal }) =>
      (await fileService.getByGroup(groupId, id, signal)) ??
      fileService.get(id, signal),
    enabled: enabled && Boolean(groupId) && Boolean(id),
  })
}

export function useUploadGroupFileMutation(groupId: string) {
  const client = useQueryClient()

  return useApiMutation(
    {
      mutationFn: (file: File) => fileService.createByGroup(groupId, file),
      onSuccess: () => client.invalidateQueries({ queryKey: fileQueryKeys.byGroup(groupId) }),
    },
    {
      loading: "Envoi du fichier…",
      success: "Le fichier a été ajoute.",
      error: "Impossible d’envoyer le fichier.",
    }
  )
}

export function useDeleteGroupFileMutation(groupId: string) {
  const client = useQueryClient()

  return useApiMutation(
    {
      mutationFn: (id: string) => fileService.removeByGroup(groupId, id),
      onSuccess: () => client.invalidateQueries({ queryKey: fileQueryKeys.byGroup(groupId) }),
    },
    {
      loading: "Suppression du fichier…",
      success: "Le fichier a été supprime.",
      error: "Impossible de supprimer le fichier.",
    }
  )
}

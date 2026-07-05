import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useApiMutation } from "@/hooks/use-api-mutation"
import type { LanguageInput } from "@/schemas/language.schema"
import { languageService } from "@/services/language.service"
import type { ApiListParams } from "@/types/api/api-data.type"

const keys = {
  all: ["configuration", "languages"] as const,
  list: (request: ApiListParams) =>
    ["configuration", "languages", "list", request] as const,
}

export function useLanguageListQuery(request: ApiListParams, enabled = true) {
  return useQuery({
    queryKey: keys.list(request),
    queryFn: ({ signal }) => languageService.list(request, signal),
    placeholderData: (previous) => previous,
    enabled,
  })
}
export function useCreateLanguageMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: languageService.create,
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Création de la langue…",
      success: "La langue a été créée.",
      error: "Impossible de créer la langue.",
    }
  )
}
export function useUpdateLanguageMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: ({
        identifier,
        input,
      }: {
        identifier: string
        input: Partial<LanguageInput>
      }) => languageService.update(identifier, input),
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Mise à jour de la langue…",
      success: "La langue a été mise à jour.",
      error: "Impossible de mettre à jour la langue.",
    }
  )
}
export function useDeleteLanguageMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: languageService.remove,
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Suppression de la langue…",
      success: "La langue a été supprimée.",
      error: "Impossible de supprimer la langue.",
    }
  )
}
export function useBulkDeleteLanguagesMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: (ids: string[]) =>
        Promise.all(ids.map(languageService.remove)),
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Suppression des langues…",
      success: "Les langues sélectionnées ont été supprimées.",
      error: "Impossible de supprimer les langues sélectionnées.",
    }
  )
}

import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query"
import { toast } from "sonner"

import {
  getApiErrorMessage,
  getApiSuccessMessage,
} from "@/lib/api-error-message"

export type MutationToastMessages = {
  loading: string
  success: string
  error: string
}

const SUCCESS_DURATION = 5_000
const ERROR_DURATION = 9_000

export function useApiMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
  messages: MutationToastMessages
): UseMutationResult<TData, TError, TVariables, TContext> {
  const mutationFn = options.mutationFn

  return useMutation({
    ...options,
    mutationFn: async (variables, context) => {
      if (!mutationFn) {
        throw new Error("Mutation function is not configured")
      }

      const toastId = toast.loading(messages.loading)
      try {
        const data = await mutationFn(variables, context)
        toast.success(getApiSuccessMessage(data, messages.success), {
          id: toastId,
          duration: SUCCESS_DURATION,
        })
        return data
      } catch (error) {
        const message = getApiErrorMessage(error, messages.error)
        if (message) {
          toast.error(message, { id: toastId, duration: ERROR_DURATION })
        } else {
          toast.dismiss(toastId)
        }
        throw error
      }
    },
  })
}

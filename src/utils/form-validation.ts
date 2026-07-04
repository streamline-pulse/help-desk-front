import type { z } from "zod"

export type FormErrors = Record<string, string | undefined>

export function getZodFormErrors(error: z.ZodError): FormErrors {
  const errors: FormErrors = {}

  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form")
    errors[field] ??= issue.message
  }

  return errors
}

export function focusFirstInvalidField(errors: FormErrors) {
  const field = Object.keys(errors).find((key) => key !== "form")
  if (!field) return

  requestAnimationFrame(() => {
    document.querySelector<HTMLElement>(`[name="${field}"]`)?.focus()
  })
}

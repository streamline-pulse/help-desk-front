import { z } from "zod"

export const groupTypeSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis.").max(120),
})

export const groupCapabilitySchema = z.object({
  name: z.string().trim().min(1, "Le code est requis.").max(120),
  label: z.string().trim().min(1, "Le libellé est requis.").max(120),
})

export type GroupTypeInput = z.infer<typeof groupTypeSchema>
export type GroupCapabilityInput = z.infer<typeof groupCapabilitySchema>

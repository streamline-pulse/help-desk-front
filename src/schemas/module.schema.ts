import { z } from "zod"

export const moduleSchema = z.object({
  name: z.string().trim().min(1, "Le code est requis.").max(120),
  label: z.string().trim().min(1, "Le libellé est requis.").max(120),
})

export type ModuleInput = z.infer<typeof moduleSchema>

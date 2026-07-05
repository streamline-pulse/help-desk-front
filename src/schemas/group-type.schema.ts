import { z } from "zod"

export const groupTypeSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis.").max(120),
})

export type GroupTypeInput = z.infer<typeof groupTypeSchema>

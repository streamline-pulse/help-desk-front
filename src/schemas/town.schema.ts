import { z } from "zod"

export const townSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis.").max(120),
  regionSlug: z.string().trim().min(1, "La région est requise."),
})

export type TownInput = z.infer<typeof townSchema>

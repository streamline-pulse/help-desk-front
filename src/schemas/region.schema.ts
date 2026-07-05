import { z } from "zod"

export const regionSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis.").max(120),
  countrySlug: z.string().trim().min(1, "Le pays est requis."),
})

export type RegionInput = z.infer<typeof regionSchema>

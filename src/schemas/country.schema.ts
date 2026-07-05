import { z } from "zod"

export const countrySchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis.").max(120),
})

export type CountryInput = z.infer<typeof countrySchema>

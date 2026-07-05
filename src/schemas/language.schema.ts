import { z } from "zod"

export const languageSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis.").max(120),
  language: z.string().trim().min(1, "Le code de langue est requis.").max(20),
})

export type LanguageInput = z.infer<typeof languageSchema>

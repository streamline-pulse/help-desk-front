import { z } from "zod"

const optionalText = z.string().trim().max(255).optional()

export const groupSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis.").max(120),
  description: z.string().trim().max(1000).optional(),
  email: z.union([z.literal(""), z.email("Adresse e-mail invalide.")]).optional(),
  website: z.union([z.literal(""), z.url("URL invalide.")]).optional(),
  parentId: optionalText,
  typeId: optionalText,
  location: z
    .object({
      placeId: optionalText,
      name: optionalText,
      lat: optionalText,
      long: optionalText,
      townSlug: optionalText,
    })
    .optional(),
})

export type GroupInput = z.infer<typeof groupSchema>

import { z } from "zod"

export const uploadGroupFileSchema = z.object({
  file: z.custom<File>((value) => value instanceof File, {
    message: "Un fichier est requis.",
  }),
})

export type UploadGroupFileInput = z.infer<typeof uploadGroupFileSchema>

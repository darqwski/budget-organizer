import * as z from "zod"
import { t } from "i18next"

export const loginSchema = z.object({
  login: z
    .string()
    .trim()
    .min(1, { error: t("Field mandatory") }),
  password: z
    .string()
    .trim()
    .min(1, { error: t("Field mandatory") }),
})

export type LoginSchema = z.output<typeof loginSchema>

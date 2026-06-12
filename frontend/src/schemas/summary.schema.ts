import * as z from "zod"
import { t } from "i18next"

export const summarySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: t("Field mandatory") }),
  description: z.string().trim(),
})

export type SummarySchema = z.output<typeof summarySchema>

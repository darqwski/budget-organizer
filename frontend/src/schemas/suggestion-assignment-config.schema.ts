import * as z from "zod"
import { t } from "i18next"

export const suggestionAssignmentConfigSchema = () =>
  z.object({
    bannedKeys: z.array(
      z.object({
        name: z
          .string()
          .trim()
          .min(1, { error: t("Field mandatory") }),
      })
    ),
  })

export type SuggestionAssignmentConfigSchema = z.output<
  ReturnType<typeof suggestionAssignmentConfigSchema>
>

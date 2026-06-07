import * as z from "zod"
import { t } from "i18next"
import type { Category } from "../model/categories.ts"

export const categorySchema = (existingCategories: Category[]) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, { error: t("Field mandatory") })
      .refine(
        (categoryName) => {
          const existingCategoryNames = existingCategories.map(
            (category) => category.name
          )
          const uniqueCategories = new Set(existingCategoryNames)
          const uniqueCategoriesWithNewCategory = new Set([
            ...existingCategoryNames,
            categoryName,
          ])

          return uniqueCategoriesWithNewCategory.size !== uniqueCategories.size
        },
        {
          message: t("This category already exist"),
        }
      ),
  })

export type CategorySchema = z.output<ReturnType<typeof categorySchema>>

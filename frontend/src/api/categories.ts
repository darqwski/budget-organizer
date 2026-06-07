import { http } from "./http.ts"
import type { Category, CategoryToAdd } from "../model/categories.ts"

export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await http.get("/categories")

  return data
}
export const mutateAddCategory = async (
  categoryToAdd: CategoryToAdd
): Promise<void> => {
  const { data } = await http.post("/categories", {
    categoriesToAdd: [categoryToAdd],
  })

  return data
}

export const mutateArchiveCategory = async (
  category: Category
): Promise<void> => {
  const { data } = await http.delete("/categories", {
    category,
  })

  return data
}

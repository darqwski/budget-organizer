import { http } from "./http.ts"
import type {
  Category,
  CategoryToAdd,
  UICategory,
} from "../model/categories.ts"
import { getColorForCategory } from "../utils/colors.ts"

export const fetchCategories = async (): Promise<UICategory[]> => {
  const { data } = await http.get<Category[]>("/categories")

  return data.map((category, index) => ({
    ...category,
    color: getColorForCategory(index, data),
  }))
}
export const mutateAddCategory = async (
  categoryToAdd: CategoryToAdd
): Promise<void> => {
  const { data } = await http.post("/categories", {
    categoriesToAdd: [categoryToAdd],
  })
}

export const mutateArchiveCategory = async (
  category: Category
): Promise<void> => {
  const { data } = await http.delete("/categories", {
    category,
  })
}

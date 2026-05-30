import { create } from "zustand"
import type { Category } from "../model/categories.ts"

type UseCategories = {
  categories: Category[]
  setCategories: (categories: Category[]) => void
}

export const useCategories = create<UseCategories>((set) => ({
  categories: [],
  setCategories: (categories: Category[]) => set({ categories }),
}))

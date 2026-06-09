import type { UICategory } from "../model/categories.ts"
import { create } from "zustand"
import { useEffect } from "react"
import { fetchCategories } from "../api/categories.ts"

type UseCategories = {
  categories: UICategory[] | null
  loading: boolean
  setCategories: (categories: UICategory[]) => void
  setLoading: (loading: boolean) => void
  refreshCategories: () => void
}

const useCategories = create<UseCategories>((set) => ({
  categories: null,
  setLoading: (loading) => set({ loading }),
  loading: false,
  setCategories: (categories: UICategory[]) => set({ categories }),
  refreshCategories: () => set({ categories: null }),
}))

export const useCategoriesFromServer = () => {
  const { categories, setCategories, setLoading, loading, refreshCategories } =
    useCategories()

  useEffect(() => {
    if (categories) {
      return
    }
    setLoading(true)
    fetchCategories()
      .then((categories) => {
        console.log("fetchedd", categories)
        setCategories(categories)
      })
      .finally(() => setLoading(false))
  }, [categories, setCategories, setLoading])

  return {
    categories,
    loading,
    refreshCategories,
  }
}

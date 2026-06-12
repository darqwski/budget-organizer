import type { Category } from "../model/categories.ts"

export const getColorForCategory = (
  index: number,
  allCategories: Category[]
) => {
  const step = 360 / allCategories.length
  const anyFirstNumber = 17 // Just to make colors more random

  return `hsl(${(index * step * anyFirstNumber + 100) % 360}deg, 82%, 57%)`
}

export type Category = {
  categoryId: number
  name: string
}

export type UICategory = Category & {
  color: string
}

export interface CategoryToAdd {
  name: string
}

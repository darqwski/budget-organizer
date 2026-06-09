export type Category = {
  categoryId: string
  name: string
}

export type UICategory = Category & {
  color: string
}

export interface CategoryToAdd {
  name: string
}

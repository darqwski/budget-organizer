import type { Category } from "./categories.ts"
import type { Reviewable } from "./reviewable.ts"

export interface Reviewed {
  reviewable: Reviewable
  category: Category
}

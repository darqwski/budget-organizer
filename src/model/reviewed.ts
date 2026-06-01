import { Reviewable } from "./reviewable"
import { Category } from "./categories"

export interface Reviewed {
  reviewable: Reviewable
  category: Category
}

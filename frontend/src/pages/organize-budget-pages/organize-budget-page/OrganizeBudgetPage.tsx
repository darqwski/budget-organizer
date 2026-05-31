import { useCategories } from "../../../global-store/categories.ts"
import { useEffect } from "react"
import { TEMP_CATEGORIES } from "../../../constants/temp-categories.ts"
import { useReviewable } from "../../../global-store/reviewable.ts"
import { Button } from "antd"
import { useReviewed } from "../../../global-store/reviewed.ts"
import { useNavigate } from "react-router"
import type { Category } from "../../../model/categories.ts"
import Reviewing from "../../../components/Rewieving/Reviewing.tsx"

const OrganizeBudgetPage = () => {
  const { setCategories, categories } = useCategories()
  const { reviewable, removeReviewable } = useReviewable()
  const { addReviewed } = useReviewed()
  const navigate = useNavigate()
  useEffect(() => {
    setCategories(TEMP_CATEGORIES)
  }, [setCategories])

  //TODO avoid useEffect
  useEffect(() => {
    if (reviewable.length === 0) {
      navigate("/budget/import-file")
    }
  }, [])

  const currentlyReviewing = reviewable[0]

  const onCategorySelected = (category: Category) => {
    if (!currentlyReviewing) {
      return
    }
    const lastReviewable = reviewable.length === 1

    addReviewed({ reviewable: { ...currentlyReviewing }, category })
    removeReviewable(currentlyReviewing)

    if (lastReviewable) {
      navigate("/budget/summary")
    }
  }

  return (
    <div>
      <div>
        <p>Reviewing</p>
        {reviewable.length > 0 ? (
          <Reviewing reviewable={currentlyReviewing} />
        ) : (
          <div>DONE</div>
        )}
      </div>
      <div>
        <p>Categories</p>
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => onCategorySelected(category)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default OrganizeBudgetPage

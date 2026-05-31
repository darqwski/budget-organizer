import { useCategories } from "../../../global-store/categories.ts"
import { useEffect } from "react"
import { TEMP_CATEGORIES } from "../../../constants/temp-categories.ts"
import { useReviewable } from "../../../global-store/reviewable.ts"
import { Button } from "antd"
import { useReviewed } from "../../../global-store/reviewed.ts"
import { useNavigate } from "react-router"
import type { Category } from "../../../model/categories.ts"
import Reviewing from "../../../components/Rewieving/Reviewing.tsx"
import { useTranslation } from "react-i18next"
import DebugUtils from "../../../components/DebugUtils.tsx"

const OrganizeBudgetPage = () => {
  const { setCategories, categories } = useCategories()
  const { reviewable, removeReviewable, moveFirstToEnd } = useReviewable()
  const { addReviewed } = useReviewed()
  const { t } = useTranslation()
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

  const fillWithRandomData = () => {
    for (const item of reviewable) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      addReviewed({ reviewable: { ...item }, category })
    }
    for (const item of reviewable) {
      removeReviewable(item)
    }

    navigate("/budget/summary")
  }

  return (
    <div className="w-full flex items-center justify-center p-8">
      <div className="w-full lg:w-1/2 flex flex-col gap-8">
        <div>
          {currentlyReviewing && <Reviewing reviewable={currentlyReviewing} />}
        </div>
        <div className="flex flex-col gap-4">
          <DebugUtils>
            <Button onClick={() => fillWithRandomData()}>Randomize</Button>
          </DebugUtils>
          <div>
            <Button
              color="yellow"
              className="w-full"
              variant="solid"
              onClick={() => moveFirstToEnd()}
            >
              {t("Take next one")}
            </Button>
          </div>
          <div className="flex flex-row flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                className="flex-grow"
                key={category.id}
                onClick={() => onCategorySelected(category)}
              >
                {category.name}
              </Button>
            ))}
          </div>
          <div>
            <Button color="blue" className="w-full" variant="solid">
              {t("Add category")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizeBudgetPage

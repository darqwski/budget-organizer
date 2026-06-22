import { useEffect } from "react"
import { useReviewable } from "../../../global-store/reviewable.ts"
import { Button } from "antd"
import { useReviewed } from "../../../global-store/reviewed.ts"
import { useNavigate } from "react-router"
import type { Category } from "../../../model/categories.ts"
import Reviewing from "../../../components/Rewieving/Reviewing.tsx"
import { useTranslation } from "react-i18next"
import DebugUtils from "../../../components/DebugUtils.tsx"
import PageWrapper from "../../../components/PageWrapper/PageWrapper.tsx"
import { useCategoriesFromServer } from "../../../api-hooks/categories.ts"
import { useAssignmentsFromServer } from "../../../api-hooks/assignments.ts"
import { suggestNewAssignmentRule } from "../../../utils/finding-assignment-rules/suggest-new-assignment-rule.ts"

const OrganizeBudgetPage = () => {
  const { categories } = useCategoriesFromServer()
  const { reviewable, removeReviewable, moveFirstToEnd } = useReviewable()
  const { addReviewed } = useReviewed()
  const { t } = useTranslation()
  useAssignmentsFromServer()
  const navigate = useNavigate()

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

    const suggestedAssignmentRules = suggestNewAssignmentRule(
      currentlyReviewing,
      category.categoryId
    )
    if (suggestedAssignmentRules.length > 0) {
      console.log({ suggestedAssignmentRules })
      // TODO
      // Show popup one by one,
      // if user accepts, add to the assignment-rule table
      // If not, also add it, but with reduced score by 100
    }

    console.log({ suggestedAssignmentRules })
    const lastReviewable = reviewable.length === 1

    addReviewed({ reviewable: { ...currentlyReviewing }, category })
    removeReviewable(currentlyReviewing)

    if (lastReviewable) {
      navigate("/budget/summary")
    }
  }

  if (!categories) {
    return
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
    <PageWrapper>
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
              key={category.categoryId}
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
    </PageWrapper>
  )
}

export default OrganizeBudgetPage

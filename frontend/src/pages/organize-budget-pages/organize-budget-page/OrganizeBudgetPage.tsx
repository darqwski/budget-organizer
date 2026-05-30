import { useCategories } from "../../../global-store/categories.ts"
import { useEffect } from "react"
import { TEMP_CATEGORIES } from "../../../constants/temp-categories.ts"

const OrganizeBudgetPage = () => {
  const { categories, setCategories } = useCategories()

  useEffect(() => {
    setCategories(TEMP_CATEGORIES)
  }, [setCategories])
  return <div>OrganizeBudgetPage</div>
}

export default OrganizeBudgetPage

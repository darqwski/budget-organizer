import { Card, Masonry } from "antd"
import { useReviewed } from "../../../global-store/reviewed.ts"
import { useCategories } from "../../../global-store/categories.ts"
import type { Category } from "../../../model/categories.ts"
import type { Reviewed } from "../../../model/reviewed.ts"

type CategorySummary = { category: Category; items: Reviewed[]; sum: number }

const SummaryBudgetPage = () => {
  const { reviewed } = useReviewed()
  const { categories } = useCategories()

  const initialMap = categories.reduce<Record<string, CategorySummary>>(
    (acc, category) => {
      acc[category.id] = {
        category,
        items: [],
        sum: 0,
      }

      return acc
    },
    {}
  )
  const summaryByCategoryId = reviewed.reduce<Record<string, CategorySummary>>(
    (acc, reviewed) => {
      acc[reviewed.category.id].items.push(reviewed)
      acc[reviewed.category.id].sum += reviewed.reviewable.money

      return acc
    },
    initialMap
  )

  const summaries = Object.values(summaryByCategoryId)

  return (
    <Masonry
      columns={3}
      items={summaries.map((summary, index) => ({
        index,
        key: summary.category.id,
        data: summary,
      }))}
      itemRender={(item) => (
        <Card size="small">
          <p>{item.data.category.name}</p>
          <p>Suma: {item.data.sum}</p>
          <p>Ilość wydatków: {item.data.items.length}</p>
        </Card>
      )}
    />
  )
}

export default SummaryBudgetPage

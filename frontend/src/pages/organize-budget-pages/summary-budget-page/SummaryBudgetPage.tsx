import { Card, Divider } from "antd"
import { useReviewed } from "../../../global-store/reviewed.ts"
import { useCategories } from "../../../global-store/categories.ts"
import type { Category } from "../../../model/categories.ts"
import type { Reviewed } from "../../../model/reviewed.ts"
import { formatMoney } from "../../../utils/format-money.ts"
import { useTranslation } from "react-i18next"
import ValueDesc from "../../../components/ValueDesc/ValueDesc.tsx"

type CategorySummary = {
  category: Category
  items: Reviewed[]
  sum: number
  currency: string
}

const SummaryBudgetPage = () => {
  const { reviewed } = useReviewed()
  const { categories } = useCategories()
  const { t } = useTranslation()
  const initialMap = categories.reduce<Record<string, CategorySummary>>(
    (acc, category) => {
      acc[category.id] = {
        category,
        items: [],
        sum: 0,
        currency: "",
      }

      return acc
    },
    {}
  )
  const summaryByCategoryId = reviewed.reduce<Record<string, CategorySummary>>(
    (acc, reviewed) => {
      acc[reviewed.category.id].items.push(reviewed)
      acc[reviewed.category.id].sum += reviewed.reviewable.money
      if (reviewed.reviewable.currency) {
        acc[reviewed.category.id].currency = reviewed.reviewable.currency
      }

      return acc
    },
    initialMap
  )

  const summaries = Object.values(summaryByCategoryId).sort((a, b) => {
    return a.sum - b.sum
  })

  const { income, costs, allItems } = summaries.reduce<{
    income: number
    costs: number
    allItems: number
  }>(
    (acc, summary) => {
      for (const item of summary.items) {
        if (item.reviewable.money > 0) {
          acc.income += item.reviewable.money
        } else {
          acc.costs += item.reviewable.money
        }
      }
      acc.allItems += summary.items.length
      return acc
    },
    {
      income: 0,
      costs: 0,
      allItems: 0,
    }
  )

  return (
    <div className="w-full flex flex-col justify-center h-full overflow-auto items-center">
      <div className="lg:w-1/2 w-full">
        <div className="flex flex-col items-center">
          {summaries.map((summary) => (
            <ValueDesc
              className="w-full"
              key={summary.category.name}
              value={formatMoney(summary.sum, summary.currency)}
              desc={summary.category.name}
            />
          ))}
        </div>
        <Divider />
        <div className="flex flex-col items-center">
          <ValueDesc className="w-full" value={income} desc={t("Income")} />
          <ValueDesc className="w-full" value={costs} desc={t("Costs")} />
          <Divider />
          <ValueDesc
            className="w-full"
            value={income + costs}
            desc={t("Total")}
          />
        </div>
        <Divider />
        <div className="flex flex-col items-center">
          <ValueDesc
            className="w-full"
            value={allItems}
            desc={t("All items")}
          />
        </div>
      </div>
    </div>
  )
}

export default SummaryBudgetPage

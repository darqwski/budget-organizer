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
      acc[reviewed.category.id].currency += reviewed.reviewable.currency

      return acc
    },
    initialMap
  )

  const summaries = Object.values(summaryByCategoryId).sort((a, b) => {
    return a.sum - b.sum
  })

  const { income, costs } = summaries.reduce<{ income: number; costs: number }>(
    (acc, summary) => {
      for (const item of summary.items) {
        if (item.reviewable.money > 0) {
          acc.income += item.reviewable.money
        } else {
          acc.costs += item.reviewable.money
        }
      }
      return acc
    },
    {
      income: 0,
      costs: 0,
    }
  )

  return (
    <div className="w-full lg:w-1/2">
      <div>
        {summaries.map((summary) => (
          <Card size="small">
            <p className="text-xl">{summary.category.name}</p>
            <p>{formatMoney(summary.sum, summary.currency)}</p>
            <p>Ilość wydatków: {summary.items.length}</p>
          </Card>
        ))}
      </div>
      <div>
        {summaries.map((summary) => (
          <p key={summary.category.name + "short"}>
            {summary.category.name}:{formatMoney(summary.sum, summary.currency)}
          </p>
        ))}
      </div>
      <div>
        <p>{t("Total summaries")}</p>
        <ValueDesc value={income} desc={t("Income")} />
        <ValueDesc value={costs} desc={t("Costs")} />
        <Divider />
        <ValueDesc value={income + costs} desc={t("Total")} />
      </div>
    </div>
  )
}

export default SummaryBudgetPage

import type { SummaryEntry } from "../../../../model/summaries.ts"
import { useTranslation } from "react-i18next"
import { formatMoney } from "../../../../utils/format-money.ts"
import { useCategoriesFromServer } from "../../../../api-hooks/categories.ts"

const SummaryEntryComparison = ({
  currentEntry,
  previousEntry,
}: {
  currentEntry: SummaryEntry | undefined
  previousEntry: SummaryEntry | undefined
}) => {
  const { t } = useTranslation()
  const { categories } = useCategoriesFromServer()
  const categoryId =
    currentEntry?.currentCategory.categoryId ??
    previousEntry?.currentCategory.categoryId
  const category = categories?.find(
    (category) => category.categoryId === categoryId
  )

  if (!category) {
    return null
  }

  const value = (previousEntry?.value || 0) - (currentEntry?.value ?? 0)
  const percentage =
    previousEntry?.value && value ? value / previousEntry.value : null
  const className = value < 0 ? "text-red" : "text-green"

  return (
    <dl
      className={["flex items-center gap-4 font-semibold", className].join(" ")}
    >
      <dd className="flex-grow w-1/2 text-right overflow-hidden text-ellipsis whitespace-nowrap">
        {t(category.name)}
      </dd>
      <dt className="flex-grow  w-1/2 text-left">
        {formatMoney(value)}
        {percentage ? ` (${(percentage * 100).toFixed(2)}%)` : null}
      </dt>
    </dl>
  )
}

export default SummaryEntryComparison

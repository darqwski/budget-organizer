import type { UICategory } from "../../../../model/categories.ts"
import type { Summary, SummaryEntry } from "../../../../model/summaries.ts"
import { useCategoriesFromServer } from "../../../../api-hooks/categories.ts"

type ChartEntry = {
  percentageStart: number
  percentageStop: number
  category: UICategory
}

const processEntriesForChart = (
  entries: SummaryEntry[],
  categories: UICategory[]
): ChartEntry[] => {
  const uICategoryById = Object.fromEntries(
    categories.map((category) => [category.categoryId, category])
  )
  const costEntries = entries
    .filter((entry) => entry.value < 0)
    .toSorted((a, b) =>
      a.currentCategory.name.localeCompare(b.currentCategory.name)
    )

  const sumOfCostEntries = costEntries
    .filter((entry) => entry.value < 0)
    .reduce((acc, item) => acc + item.value, 0)

  let accumulator = 0

  return costEntries.map((entry) => {
    const accumulatorForEntry = accumulator
    const percentage = (entry.value * 100) / sumOfCostEntries
    accumulator += percentage

    return {
      percentageStart: accumulatorForEntry,
      percentageStop: accumulator,
      category:
        uICategoryById[entry.currentCategory.categoryId] ??
        entry.currentCategory,
      accumulator: accumulatorForEntry,
    }
  })
}

const mapChartEntriesToStyle = (entries: ChartEntry[]) => {
  return {
    background: `conic-gradient(${entries.map((entry) => `${entry.category.color} ${entry.percentageStart}% ${entry.percentageStop}%`).join(", ")})`,
  }
}

const SummaryPieChart = ({
  summary,
  className,
}: {
  summary: Summary
  className?: string
}) => {
  const { categories } = useCategoriesFromServer()
  const entriesForChart = processEntriesForChart(
    summary.entries,
    categories ?? []
  )

  return (
    <div
      className={[
        "aspect-square border-2 border-black border-solid rounded-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={mapChartEntriesToStyle(entriesForChart)}
    ></div>
  )
}

export default SummaryPieChart

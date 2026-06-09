import type { Summary, SummaryEntry } from "../../../../model/summaries.ts"
import { Card } from "antd"
import { formatMoney } from "../../../../utils/format-money.ts"
import "./SummaryTile.css"
import type { UICategory } from "../../../../model/categories.ts"
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
    .toSorted((a, b) => a.value - b.value)

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

const SummaryTile = ({ summary }: { summary: Summary }) => {
  const { categories } = useCategoriesFromServer()
  const entriesForChart = processEntriesForChart(
    summary.entries,
    categories ?? []
  )
  const className = [
    "w-full text-center font-semibold",
    summary.balance > 0 ? "text-green" : "text-red",
  ].join(" ")

  return (
    <Card hoverable className="min-w-[20%] p-2 flex flex-col gap-4">
      <p className="text-xl w-full text-center">{summary.title}</p>
      <div
        className="aspect-square border-2 border-black border-solid rounded-full"
        style={mapChartEntriesToStyle(entriesForChart)}
      ></div>
      <p className={className}>{formatMoney(summary.balance)}</p>
    </Card>
  )
}

export default SummaryTile

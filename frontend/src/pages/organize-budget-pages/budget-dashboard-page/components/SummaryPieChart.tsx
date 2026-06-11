import type { UICategory } from "../../../../model/categories.ts"
import type { Summary, SummaryEntry } from "../../../../model/summaries.ts"
import { useCategoriesFromServer } from "../../../../api-hooks/categories.ts"
import { Pie } from "react-chartjs-2"
import {
  Chart,
  type ChartData,
  type ChartDataset,
  type ChartOptions,
} from "chart.js"
import { useRef } from "react"
import { formatMoney } from "../../../../utils/format-money.ts"

const processEntriesForChart = (
  entries: SummaryEntry[],
  categories: UICategory[]
): ChartData<"pie"> => {
  const uICategoryById = Object.fromEntries(
    categories.map((category) => [category.categoryId, category])
  )
  const costEntries = entries
    .filter((entry) => entry.value < 0)
    .toSorted((a, b) =>
      a.currentCategory.name.localeCompare(b.currentCategory.name)
    )

  const uniqueCategoryIds = Array.from(
    new Set(
      costEntries.map((costEntry) => costEntry.currentCategory.categoryId)
    )
  )

  const uiCategories = uniqueCategoryIds.map(
    (categoryId) => uICategoryById[categoryId]
  )

  const dataset: ChartDataset<"pie"> = {
    data: costEntries.map((costEntry) => costEntry.value),
    backgroundColor: uiCategories.map((category) => category.color),
  }

  return {
    datasets: [dataset],
    labels: uiCategories.map((category) => category.name),
  }
}

const SummaryPieChart = ({
  summary,
  className,
  withLegend = false,
}: {
  summary: Summary
  className?: string
  withLegend?: boolean
}) => {
  const { categories } = useCategoriesFromServer()
  const ref = useRef<Chart<"pie"> | null>(null)
  if (!categories) {
    return null
  }

  const chartData = processEntriesForChart(summary.entries, categories ?? [])

  const options: ChartOptions<"pie"> = {
    plugins: {
      legend: {
        display: withLegend,
        labels: {},
        align: "start",
        position: "bottom",
      },
      tooltip: {
        boxPadding: 5,
        bodyFont: { weight: "bold" },
        callbacks: {
          label: (tooltipItem) => {
            return formatMoney(Math.abs(+tooltipItem.formattedValue))
          },
        },
      },
    },
    layout: {
      padding: 0,
    },
  }

  return (
    <Pie
      ref={ref}
      options={options}
      id={`${summary.summaryId}`}
      className={className}
      data={chartData}
    ></Pie>
  )
}

export default SummaryPieChart

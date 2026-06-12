import PageWrapper from "../../components/PageWrapper/PageWrapper.tsx"
import { useSummariesFromServer } from "../../api-hooks/summaries.ts"
import { useEffect } from "react"
import { Line } from "react-chartjs-2"
import type { ChartData, ChartDataset, Point } from "chart.js"
import { useCategoriesFromServer } from "../../api-hooks/categories.ts"
import type { Summary } from "../../model/summaries.ts"
import type { UICategory } from "../../model/categories.ts"

const procesSummaries = (
  summaries: Summary[],
  categories: UICategory[]
): ChartDataset<"line">[] => {
  const datasets: ChartDataset<"line">[] = []
  const uiCategoryById = Object.fromEntries(
    categories.map((category) => [category.categoryId, category])
  )

  const pointsByCategoryId: Record<string, Point[]> = {}

  for (const summary of summaries) {
    for (const entry of summary.entries) {
      if (entry.currentCategory.name === "Wypłata") {
        continue
      }
      pointsByCategoryId[entry.currentCategory.categoryId] ??= []
      pointsByCategoryId[entry.currentCategory.categoryId].push({
        x: summary.created,
        y: Math.abs(entry.value),
      })
    }
  }

  for (const [categoryId, points] of Object.entries(pointsByCategoryId)) {
    const category = uiCategoryById[categoryId]
    datasets.push({
      label: category?.name ?? `Unknown category ${categoryId}`,
      data: points,
      fill: false,
      borderColor: category?.color ?? "#000000",
      backgroundColor: category?.color ?? "#000000",
    })
  }

  return datasets
}

const StatisticsPage = () => {
  const { summaries, refreshSummaries } = useSummariesFromServer()
  const { categories } = useCategoriesFromServer()
  useEffect(() => {
    refreshSummaries()
  }, [refreshSummaries])

  if (!summaries || !categories) {
    return null
  }

  const chartData: ChartData<"line"> = {
    datasets: procesSummaries(summaries, categories),
  }

  return (
    <PageWrapper>
      <Line data={chartData} />
    </PageWrapper>
  )
}

export default StatisticsPage

import type { Summary, SummaryEntry } from "../../../../model/summaries.ts"
import { Card } from "antd"
import { formatMoney } from "../../../../utils/format-money.ts"
import "./SummaryTile.css"

type ChartEntry = {
  percentageStart: number
  percentageStop: number
  name: string
  color: string
}

const processEntriesForChart = (entries: SummaryEntry[]): ChartEntry[] => {
  const costEntries = entries
    .filter((entry) => entry.value < 0)
    .toSorted((a, b) => a.value - b.value)

  const sumOfCostEntries = costEntries
    .filter((entry) => entry.value < 0)
    .reduce((acc, item) => acc + item.value, 0)
  const step = 360 / costEntries.length
  const getColor = (index: number) =>
    `hsl(${(index * step + 100) % 360}deg, 79%, 78%)`
  let accumulator = 0
  return costEntries.map((entry, index) => {
    const accumulatorForEntry = accumulator
    const percentage = (entry.value * 100) / sumOfCostEntries
    accumulator += percentage

    return {
      percentageStart: accumulatorForEntry,
      percentageStop: accumulator,
      color: getColor(index),
      name: entry.currentCategory.name,
      accumulator: accumulatorForEntry,
    }
  })
}

const mapChartEntriesToStyle = (entries: ChartEntry[]) => {
  console.log(entries)
  return {
    background: `conic-gradient(${entries.map((entry) => `${entry.color} ${entry.percentageStart}% ${entry.percentageStop}%`).join(", ")})`,
  }
}

const SummaryTile = ({ summary }: { summary: Summary }) => {
  const entriesForChart = processEntriesForChart(summary.entries)

  return (
    <Card className="p-4">
      <div
        className="aspect-square border-2 border-black border-solid rounded-full"
        style={mapChartEntriesToStyle(entriesForChart)}
      ></div>
      <p>{formatMoney(summary.balance)}</p>
    </Card>
  )
}

export default SummaryTile

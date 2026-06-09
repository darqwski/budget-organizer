import type { Summary } from "../../../../model/summaries.ts"
import { Card } from "antd"
import { formatMoney } from "../../../../utils/format-money.ts"
import "./SummaryTile.css"
import type { MouseEventHandler } from "react"
import SummaryPieChart from "./SummaryPieChart.tsx"

const SummaryTile = ({
  summary,
  onClick,
}: {
  summary: Summary
  onClick?: MouseEventHandler<HTMLDivElement>
}) => {
  const className = [
    "w-full text-center font-semibold",
    summary.balance > 0 ? "text-green" : "text-red",
  ].join(" ")

  return (
    <Card
      hoverable
      className="w-[30%] p-2 flex flex-col gap-4"
      onClick={onClick}
    >
      <p className="text-xl w-full text-center">{summary.title}</p>
      <SummaryPieChart summary={summary} />
      <p className={className}>{formatMoney(summary.balance)}</p>
    </Card>
  )
}

export default SummaryTile

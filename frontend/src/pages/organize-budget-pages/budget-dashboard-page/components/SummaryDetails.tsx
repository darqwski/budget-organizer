import type { Summary } from "../../../../model/summaries.ts"
import type { Dispatch, SetStateAction } from "react"
import ValueDesc from "../../../../components/ValueDesc/ValueDesc.tsx"
import { Button, Card, Divider } from "antd"
import { useTranslation } from "react-i18next"
import SummaryPieChart from "./SummaryPieChart.tsx"
import { formatMoney } from "../../../../utils/format-money.ts"

const SummaryDetails = ({
  summary,
  setActiveSummary,
}: {
  summary: Summary
  setActiveSummary: Dispatch<SetStateAction<Summary | undefined>>
}) => {
  const { t } = useTranslation()
  const sortedSummaryEntries = summary.entries.toSorted(
    (a, b) => a.value - b.value
  )

  const className = [
    "font-semibold flex-grow w-1/2 text-left",
    summary.balance > 0 ? "text-green" : "text-red",
  ].join(" ")

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => setActiveSummary(undefined)}>
        {t("Go back to all summaries")}
      </Button>
      <div className="flex gap-2">
        <Card className="flex-grow w-1/3 flex flex-col gap-4">
          <SummaryPieChart summary={summary} />
        </Card>
        <Card className="flex-grow w-1/3">
          {sortedSummaryEntries.map((entry) => (
            <ValueDesc
              value={formatMoney(entry.value)}
              desc={entry.currentCategory.name}
            />
          ))}
          <Divider />
          <dl className="flex items-center gap-4">
            <dd className="flex-grow w-1/2 text-right font-semibold">
              {t("Balance")}
            </dd>
            <dt className={className}>{formatMoney(summary.balance)}</dt>
          </dl>
        </Card>
        <Card className="flex-grow w-1/3">
          <p>{t("Comparing to previous month")}</p>
          <p>// TODO Comparing to previous month</p>
          <p>// TODO install chart librarty</p>
          <p>// TODO prepare view for comparing specific categories</p>
        </Card>
      </div>
    </div>
  )
}

export default SummaryDetails

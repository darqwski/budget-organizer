import type { Summary, SummaryEntry } from "../../../../model/summaries.ts"
import type { Dispatch, SetStateAction } from "react"
import ValueDesc from "../../../../components/ValueDesc/ValueDesc.tsx"
import { Button, Card, Divider } from "antd"
import { useTranslation } from "react-i18next"
import SummaryPieChart from "./SummaryPieChart.tsx"
import { formatMoney } from "../../../../utils/format-money.ts"
import SummaryEntryComparison from "./SummaryEntryComparison.tsx"

type ComparisonEntry = {
  previousEntry: SummaryEntry | undefined
  currentEntry: SummaryEntry | undefined
}

const createComparisonEntries = (
  currentSummary: Summary,
  previousSummary: Summary | undefined
): ComparisonEntry[] => {
  const currentSummaryEntriesByCategoryId = Object.fromEntries(
    currentSummary.entries.map((entry) => [
      entry.currentCategory.categoryId,
      entry,
    ])
  )

  const previousSummaryEntriesByCategoryId = Object.fromEntries(
    (previousSummary?.entries ?? []).map((entry) => [
      entry.currentCategory.categoryId,
      entry,
    ])
  )

  const categoriesFromBothSummaries = new Set([
    ...Object.keys(currentSummaryEntriesByCategoryId),
    ...Object.keys(previousSummaryEntriesByCategoryId),
  ])

  return [...categoriesFromBothSummaries.values()].map((categoryId) => {
    const currentEntry = currentSummaryEntriesByCategoryId[categoryId]
    const previousEntry = previousSummaryEntriesByCategoryId[categoryId]
    return {
      currentEntry,
      previousEntry,
    }
  })
}

const SummaryDetails = ({
  summary,
  setActiveSummary,
  previousSummary,
}: {
  summary: Summary
  previousSummary: Summary | undefined
  setActiveSummary: Dispatch<SetStateAction<Summary | undefined>>
}) => {
  const { t } = useTranslation()
  const sortedSummaryEntries = summary.entries.toSorted(
    (a, b) => a.value - b.value
  )
  const comparisonEntries = createComparisonEntries(summary, previousSummary)

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
          {previousSummary ? (
            comparisonEntries.map((comparisonEntry) => (
              <SummaryEntryComparison
                key={
                  comparisonEntry.previousEntry?.currentCategory?.categoryId ??
                  comparisonEntry.currentEntry?.currentCategory?.categoryId
                }
                previousEntry={comparisonEntry.previousEntry}
                currentEntry={comparisonEntry.currentEntry}
              />
            ))
          ) : (
            <div>{t("Nothing to compare")}</div>
          )}
          <p>// TODO install chart librarty</p>
          <p>// TODO prepare view for comparing specific categories</p>
        </Card>
      </div>
    </div>
  )
}

export default SummaryDetails

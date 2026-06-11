import PageWrapper from "../../../components/PageWrapper/PageWrapper.tsx"
import type { Summary } from "../../../model/summaries.ts"
import { useState } from "react"
import SummaryList from "./components/SummaryList.tsx"
import SummaryDetails from "./components/SummaryDetails.tsx"
import { useSummariesFromServer } from "../../../api-hooks/summaries.ts"

const findPreviousSummary = (
  activeSummary: Summary | undefined,
  allSummaries: Summary[] | null
) => {
  if (!activeSummary || !allSummaries) {
    return undefined
  }
  const activeSummaryDate = new Date(activeSummary.created)

  return allSummaries.reduce<Summary | undefined>((closestSummary, summary) => {
    const summaryDate = new Date(summary.created)
    const beforeActiveSummary =
      summaryDate.getTime() < activeSummaryDate.getTime()

    if (!beforeActiveSummary) {
      return closestSummary
    }

    if (!closestSummary) {
      return summary
    }

    return new Date(closestSummary.created).getTime() < summaryDate.getTime()
      ? summary
      : closestSummary
  }, undefined)
}

const BudgetDashboardPage = () => {
  const { summaries } = useSummariesFromServer()
  const [activeSummary, setActiveSummary] = useState<undefined | Summary>()

  const previousSummary = findPreviousSummary(activeSummary, summaries)

  return (
    <PageWrapper>
      {activeSummary ? (
        <SummaryDetails
          previousSummary={previousSummary}
          summary={activeSummary}
          setActiveSummary={setActiveSummary}
        />
      ) : (
        <SummaryList setActiveSummary={setActiveSummary} />
      )}
    </PageWrapper>
  )
}

export default BudgetDashboardPage

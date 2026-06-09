import { useTranslation } from "react-i18next"
import PageWrapper from "../../../components/PageWrapper/PageWrapper.tsx"
import DebugUtils from "../../../components/DebugUtils.tsx"
import { http } from "../../../api/http.ts"
import type {
  Summary,
  SummaryEntryToAdd,
  SummaryToAdd,
} from "../../../model/summaries.ts"
import { formatDate } from "../../../utils/format-date.ts"
import { useCategoriesFromServer } from "../../../api-hooks/categories.ts"
import type { Category } from "../../../model/categories.ts"
import { useState } from "react"
import SummaryList from "./components/SummaryList.tsx"
import SummaryDetails from "./components/SummaryDetails.tsx"

const addDebugSummary = async (categories: Category[] | null) => {
  if (!categories) {
    return
  }

  const incomeCategoryName = "Wypłata"
  const randomEntries = [...categories]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * categories.length))
    .filter((category) => category.name !== incomeCategoryName)

  const incomeCategory = categories.find(
    (category) => category.name === incomeCategoryName
  )
  const entriesToAdd: SummaryEntryToAdd[] = randomEntries.map(
    (randomEntry) => ({
      category: randomEntry,
      value: Math.random() * -1000,
    })
  )

  entriesToAdd.push({
    category: incomeCategory!,
    value: (1000 + (Math.random() - 0.5) * 200) * randomEntries.length,
  })
  const summaryToAdd: SummaryToAdd = {
    description: [
      "debug description",
      formatDate(new Date()),
      Math.round(Math.random() * 100),
    ].join("-"),
    title: [
      "debug title",
      formatDate(new Date()),
      Math.round(Math.random() * 100),
    ].join("-"),
    entries: entriesToAdd,
  }
  await http.post("/summaries/", { summaryToAdd })
}

const BudgetDashboardPage = () => {
  const { categories } = useCategoriesFromServer()
  const [activeSummary, setActiveSummary] = useState<undefined | Summary>()

  return (
    <PageWrapper>
      {activeSummary ? (
        <SummaryDetails
          summary={activeSummary}
          setActiveSummary={setActiveSummary}
        />
      ) : (
        <SummaryList setActiveSummary={setActiveSummary} />
      )}

      <DebugUtils>
        <button onClick={() => addDebugSummary(categories)}>
          {" "}
          Add summary{" "}
        </button>
      </DebugUtils>
    </PageWrapper>
  )
}

export default BudgetDashboardPage

import { useTranslation } from "react-i18next"
import PageWrapper from "../../../components/PageWrapper/PageWrapper.tsx"
import DebugUtils from "../../../components/DebugUtils.tsx"
import { http } from "../../../api/http.ts"
import type {
  SummaryEntryToAdd,
  SummaryToAdd,
} from "../../../model/summaries.ts"
import { formatDate } from "../../../utils/format-date.ts"
import { useCategoriesFromServer } from "../../../api-hooks/categories.ts"
import { useSummariesFromServer } from "../../../api-hooks/summaries.ts"
import type { Category } from "../../../model/categories.ts"
import SummaryTile from "./components/SummaryTile.tsx"

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
  const { t } = useTranslation()
  const { categories } = useCategoriesFromServer()
  const { summaries } = useSummariesFromServer()

  return (
    <PageWrapper>
      <a href="../budget/organize">
        <div>{t("Organize budget")}</div>
      </a>

      <div className="flex flex-wrap w-full">
        {summaries?.map((summary) => (
          <SummaryTile summary={summary} />
        ))}
      </div>
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

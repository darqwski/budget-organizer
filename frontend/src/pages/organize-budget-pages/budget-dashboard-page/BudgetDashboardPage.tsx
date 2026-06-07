import { useTranslation } from "react-i18next"
import PageWrapper from "../../../components/PageWrapper/PageWrapper.tsx"
import DebugUtils from "../../../components/DebugUtils.tsx"
import { http } from "../../../api/http.ts"
import type {
  SummaryEntryToAdd,
  SummaryToAdd,
} from "../../../model/summaries.ts"
import { formatDate } from "../../../utils/format-date.ts"
import { TEMP_CATEGORIES } from "../../../constants/temp-categories.ts"

const BudgetDashboardPage = () => {
  const { t } = useTranslation()

  const addDebugSummary = async () => {
    const randomEntries = [...TEMP_CATEGORIES]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * TEMP_CATEGORIES.length))

    const entriesToAdd: SummaryEntryToAdd[] = randomEntries.map(
      (randomEntry) => ({
        category: randomEntry,
        value: Math.random() * -1000,
      })
    )

    entriesToAdd.push({
      category: { name: "Wypłata", categoryId: "-2" },
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
    await http.post("/summary/add", { summaryToAdd })
  }

  return (
    <PageWrapper>
      <a href="../budget/organize">
        <div>{t("Organize budget")}</div>
      </a>
      <DebugUtils>
        <button onClick={() => addDebugSummary()}> Add summary </button>
      </DebugUtils>
    </PageWrapper>
  )
}

export default BudgetDashboardPage

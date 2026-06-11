import { Card } from "antd"
import { LineChartOutlined, PlusCircleFilled } from "@ant-design/icons"
import SummaryTile from "./SummaryTile.tsx"
import type { Dispatch, SetStateAction } from "react"
import type {
  Summary,
  SummaryEntryToAdd,
  SummaryToAdd,
} from "../../../../model/summaries.ts"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { useSummariesFromServer } from "../../../../api-hooks/summaries.ts"
import DebugUtils from "../../../../components/DebugUtils.tsx"
import type { Category } from "../../../../model/categories.ts"
import { formatDate } from "../../../../utils/format-date.ts"
import { http } from "../../../../api/http.ts"
import { useCategoriesFromServer } from "../../../../api-hooks/categories.ts"

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

const SummaryList = ({
  setActiveSummary,
}: {
  setActiveSummary: Dispatch<SetStateAction<Summary | undefined>>
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { summaries } = useSummariesFromServer()
  const { categories } = useCategoriesFromServer()

  return (
    <>
      <div className="flex flex-wrap w-full gap-4">
        <Card
          hoverable
          className="w-[30%] p-2 flex flex-col gap-4"
          onClick={() => navigate("../budget/import-file")}
        >
          <p className="text-xl w-full text-center">{t("Add new summary")}</p>
          <div className="aspect-square flex items-center justify-center">
            <PlusCircleFilled className="text-[5rem] text-green" />
          </div>
          <p className="text-xl w-full text-center">{t("Organize budget")}</p>
        </Card>
        <Card
          hoverable
          className="w-[30%] p-2 flex flex-col gap-4"
          onClick={() => navigate("../statistics")}
        >
          <p className="text-xl w-full text-center">{t("View statistics")}</p>
          <div className="aspect-square flex items-center justify-center">
            <LineChartOutlined className="text-[5rem] text-green" />
          </div>
          <p className="text-xl w-full text-center">
            {t("For budgets or categories")}
          </p>
        </Card>
        {summaries?.map((summary) => (
          <SummaryTile
            onClick={() => setActiveSummary(summary)}
            summary={summary}
          />
        ))}

        <DebugUtils>
          <Card
            hoverable
            className="w-[30%] p-2 flex flex-col gap-4"
            onClick={() => addDebugSummary(categories)}
          >
            <p className="text-xl w-full text-center">
              {t("Add random summary")}
            </p>
            <div className="aspect-square flex items-center justify-center">
              <PlusCircleFilled className="text-[5rem] text-red" />
            </div>
            <p className="text-xl w-full text-center">
              {t("Add random summary")}
            </p>
          </Card>
        </DebugUtils>
      </div>
    </>
  )
}

export default SummaryList

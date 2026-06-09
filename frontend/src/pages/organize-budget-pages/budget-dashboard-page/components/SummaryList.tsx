import { Card } from "antd"
import { PlusCircleFilled } from "@ant-design/icons"
import SummaryTile from "./SummaryTile.tsx"
import type { Dispatch, SetStateAction } from "react"
import type { Summary } from "../../../../model/summaries.ts"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { useSummariesFromServer } from "../../../../api-hooks/summaries.ts"
import CategoryLegendTile from "./CategoryLegendTile.tsx"
import { useCategoriesFromServer } from "../../../../api-hooks/categories.ts"

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
        {summaries?.map((summary) => (
          <SummaryTile
            onClick={() => setActiveSummary(summary)}
            summary={summary}
          />
        ))}
      </div>
      <div className="flex flex-wrap w-full gap-4">
        {categories?.map((category) => (
          <CategoryLegendTile key={category.categoryId} category={category} />
        ))}
      </div>
    </>
  )
}

export default SummaryList

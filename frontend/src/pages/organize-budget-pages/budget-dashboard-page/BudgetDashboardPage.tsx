import { useTranslation } from "react-i18next"
import PageWrapper from "../../../components/PageWrapper/PageWrapper.tsx"

const BudgetDashboardPage = () => {
  const { t } = useTranslation()
  return (
    <PageWrapper>
      <a href="../budget/organize">
        <div>{t("Organize budget")}</div>
      </a>
    </PageWrapper>
  )
}

export default BudgetDashboardPage

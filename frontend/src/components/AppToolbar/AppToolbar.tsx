import { Link } from "react-router"
import { useTranslation } from "react-i18next"

const AppToolbar = () => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-row w-full gap-4">
      <div>BudgetOrganizer</div>
      <div className="flex flex-row flex-grow justify-between gap-4">
        <Link to="/" className="flex items-center text-center content-center">
          {t("Landing Page")}
        </Link>
        <Link
          to="/budget/"
          className="flex items-center text-center content-center"
        >
          {t("Organize Budget")}
        </Link>
        <Link
          to="/manage-categories"
          className="flex items-center text-center content-center"
        >
          {t("Categories")}
        </Link>
      </div>
      <div>Login/Logout/Settings</div>
    </div>
  )
}

export default AppToolbar

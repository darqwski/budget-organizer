import { Link, useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import {
  COOKIE_SESSION_ID_KEY,
  getCookieByName,
  outdateCookie,
} from "../../utils/cookies.ts"
import { Button } from "antd"

const AppToolbar = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const isLoggedIn = getCookieByName(COOKIE_SESSION_ID_KEY)

  const logout = () => {
    outdateCookie(COOKIE_SESSION_ID_KEY)
    navigate("/login")
  }

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
      <div>
        {isLoggedIn ? (
          <div className="flex gap-2 items-center h-full">
            <Button variant="text" onClick={logout}>
              {t("Logout")}
            </Button>
          </div>
        ) : (
          <Button variant="text" onClick={() => navigate("/login")}>
            {t("Login")}
          </Button>
        )}
      </div>
    </div>
  )
}

export default AppToolbar

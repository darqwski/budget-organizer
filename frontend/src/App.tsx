import { createBrowserRouter, Outlet } from "react-router"
import LandingPage from "./pages/landing-page/LandingPage.tsx"
import ManageCategoriesPage from "./pages/manage-categories-page/ManageCategoriesPage.tsx"
import ImportFilePage from "./pages/organize-budget-pages/import-file-page/ImportFilePage.tsx"
import OrganizeBudgetPage from "./pages/organize-budget-pages/organize-budget-page/OrganizeBudgetPage.tsx"
import SummaryBudgetPage from "./pages/organize-budget-pages/summary-budget-page/SummaryBudgetPage.tsx"
import { ConfigProvider, Layout } from "antd"
import AppToolbar from "./components/AppToolbar/AppToolbar.tsx"
import { colors } from "./constants/colors.ts"
import LoginPage from "./pages/login-page/LoginPage.tsx"
import BudgetDashboardPage from "./pages/organize-budget-pages/budget-dashboard-page/BudgetDashboardPage.tsx"

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: colors.primary,
          colorPrimaryBg: colors["primary-bg"],
          yellow: colors.warning,
        },
      }}
    >
      <Layout className="w-full h-full bg-white">
        <Layout.Header className="bg-primary text-white">
          <AppToolbar />
        </Layout.Header>
        <Layout.Content>
          <Outlet />
        </Layout.Content>
        <Layout.Footer>Footer</Layout.Footer>
      </Layout>
      <div className="text-red-100 text-green"></div>
    </ConfigProvider>
  )
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: LandingPage },
      {
        path: "manage-categories",
        Component: ManageCategoriesPage,
      },
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "budget",
        children: [
          {
            index: true,
            Component: BudgetDashboardPage,
          },
          { path: "import-file", Component: ImportFilePage },
          { path: "organize", Component: OrganizeBudgetPage },
          { path: "summary", Component: SummaryBudgetPage },
        ],
      },
    ],
  },
])

import { createBrowserRouter, Link, Navigate, Outlet } from "react-router"
import LandingPage from "./pages/landing-page/LandingPage.tsx"
import ManageCategoriesPage from "./pages/manage-categories-page/ManageCategoriesPage.tsx"
import ImportFilePage from "./pages/organize-budget-pages/import-file-page/ImportFilePage.tsx"
import OrganizeBudgetPage from "./pages/organize-budget-pages/organize-budget-page/OrganizeBudgetPage.tsx"
import SummaryBudgetPage from "./pages/organize-budget-pages/summary-budget-page/SummaryBudgetPage.tsx"
import { Button, Layout, Typography } from "antd"

const App = () => {
  return (
    <Layout className="w-full h-full bg-white">
      <Layout.Header className="bg-primary-bg text-white">
        <div className="flex flex-row w-full gap-4">
          <div>BudgetOrganizer</div>
          <div className="flex flex-row flex-grow justify-between gap-4">
            <Link
              to="/"
              className="flex items-center text-center content-center"
            >
              Landing Page
            </Link>
            <Link
              to="/budget/"
              className="flex items-center text-center content-center"
            >
              Organize Budget
            </Link>
            <Link
              to="/manage-categories"
              className="flex items-center text-center content-center"
            >
              Manage Categories
            </Link>
          </div>
          <div>Login/Logout/Settings</div>
        </div>
      </Layout.Header>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
      <Layout.Footer>Footer</Layout.Footer>
    </Layout>
  )
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: LandingPage },
      {
        path: "manage",
        Component: ManageCategoriesPage,
      },
      {
        path: "budget",
        children: [
          {
            index: true,
            Component: () => <Navigate to="/budget/import-file" replace />,
          },
          { path: "import-file", Component: ImportFilePage },
          { path: "organize", Component: OrganizeBudgetPage },
          { path: "summary", Component: SummaryBudgetPage },
        ],
      },
    ],
  },
])

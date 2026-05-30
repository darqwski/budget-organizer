import { createBrowserRouter, Navigate, Outlet } from "react-router"
import LandingPage from "./pages/landing-page/LandingPage.tsx"
import ManageCategoriesPage from "./pages/manage-categories-page/ManageCategoriesPage.tsx"
import ImportFilePage from "./pages/organize-budget-pages/import-file-page/ImportFilePage.tsx"
import OrganizeBudgetPage from "./pages/organize-budget-pages/organize-budget-page/OrganizeBudgetPage.tsx"
import SummaryBudgetPage from "./pages/organize-budget-pages/summary-budget-page/SummaryBudgetPage.tsx"
import { Layout } from "antd"
import AppToolbar from "./components/AppToolbar/AppToolbar.tsx"

const App = () => {
  return (
    <Layout className="w-full h-full bg-white">
      <Layout.Header className="bg-primary-bg text-white">
        <AppToolbar />
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

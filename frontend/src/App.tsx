import {createBrowserRouter, Navigate, Outlet} from "react-router";
import LandingPage from "./pages/landing-page/LandingPage.tsx";
import ManageCategoriesPage from "./pages/manage-categories-page/ManageCategoriesPage.tsx";
import ImportFilePage from "./pages/organize-budget-pages/import-file-page/ImportFilePage.tsx";
import OrganizeBudgetPage from "./pages/organize-budget-pages/organize-budget-page/OrganizeBudgetPage.tsx";
import SummaryBudgetPage from "./pages/organize-budget-pages/summary-budget-page/SummaryBudgetPage.tsx";

const App = () => {

  return (
    <div className="w-full h-full text-primary font-bold text-7xl">
      <div className="bg-primary-bg text-white">TOOOLBAR</div>
      <Outlet />
    </div>
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
          { index: true, Component: () => <Navigate to="/budget/import-file" replace />,  },
          { path: "import-file", Component: ImportFilePage },
          { path: "organize", Component: OrganizeBudgetPage },
          { path: "summary", Component: SummaryBudgetPage },
        ],
      },
    ],
  },
]);
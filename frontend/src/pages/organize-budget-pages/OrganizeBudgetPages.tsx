import { Outlet } from "react-router"

const OrganizeBudgetPages = () => {
  return (
    <div>
      <Outlet />
      <div>Step {1}</div>
    </div>
  )
}

export default OrganizeBudgetPages

import PageWrapper from "../../components/PageWrapper/PageWrapper.tsx"
import { LoadingOutlined } from "@ant-design/icons"
import { useConfigsFromServer } from "../../api-hooks/configs.ts"
import ManageConfigsPageForm from "./ManageConfigsPageForm.tsx"

const ManageConfigsPage = () => {
  const { suggestAssignmentsConfig, loading } = useConfigsFromServer()

  return (
    <PageWrapper className="gap-8">
      {loading ? (
        <div>
          <LoadingOutlined />
        </div>
      ) : (
        <ManageConfigsPageForm
          suggestAssignmentsConfig={suggestAssignmentsConfig ?? null}
        />
      )}
    </PageWrapper>
  )
}

export default ManageConfigsPage

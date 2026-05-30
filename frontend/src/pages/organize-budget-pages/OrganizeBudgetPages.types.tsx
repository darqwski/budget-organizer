import type { Dispatch, SetStateAction } from "react"

export type OrganizeBudgetPagesProps = {
  setUploadedFile: Dispatch<SetStateAction<File | null>>
  uploadedFile: File | null
}

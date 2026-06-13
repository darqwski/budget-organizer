export interface Assignment {
  assignmentId: number
  summaryId: number
  categoryId: number
  payment: Record<string, string>
  created: number | null
}
export interface AssignmentToAdd {
  summaryId: number
  categoryId: number
  payment: Record<string, string | number | null>
}

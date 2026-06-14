import type { Reviewable } from "./reviewable.ts"

type AssignmentPayment = Record<string, number | string | null> &
  Omit<Reviewable, "details">

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

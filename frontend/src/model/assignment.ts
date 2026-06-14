import type { Reviewable } from "./reviewable.ts"

export type PaymentDetailsValue = number | string | null
export type PaymentDetails = Record<string, PaymentDetailsValue>
type AssignmentPayment = Record<string, PaymentDetailsValue> &
  Omit<Reviewable, "details">

export interface Assignment {
  assignmentId: number
  summaryId: number
  categoryId: number
  payment: AssignmentPayment
  created: number | null
}
export interface AssignmentToAdd {
  summaryId: number
  categoryId: number
  payment: AssignmentPayment
}

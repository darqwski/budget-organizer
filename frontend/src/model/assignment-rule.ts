import type { Summary } from "./summaries.ts"
import type { PaymentDetailsValue } from "./assignment.ts"

export type ComparisonRule = {
  ruleName: "string-match"
  ruleValues: Record<string, string | number>
  value: PaymentDetailsValue
}

export type MinimalPaymentComparison = Record<string, ComparisonRule>

export interface AssignmentRule {
  assignmentRuleId: number
  categoryId: number
  minimalPayment: MinimalPaymentComparison
  summary: Summary
  created: number | null
}

export type AssignmentRuleToAdd = Pick<
  AssignmentRule,
  "categoryId" | "minimalPayment"
>

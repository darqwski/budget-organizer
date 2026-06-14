import type { Summary } from "./summaries.ts"

export type ComparisonRule = {
  ruleName: "string-match"
  ruleValues: Record<string, string | number>
  value: string | number
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

import type {
  AssignmentRuleToAdd,
  ComparisonRule,
} from "../../model/assignment-rule.ts"
import type { Reviewable } from "../../model/reviewable.ts"
import type {
  Assignment,
  AssignmentToAdd,
  PaymentDetails,
} from "../../model/assignment.ts"
import { mapRevieableToAssignmentToAdd } from "../../pages/organize-budget-pages/summary-budget-page/SummaryBudgetPage.tsx"
import { getListOfCombinations } from "./get-list-of-combinations.ts"
import { jaroDistance } from "./jaro-comparison.ts"
import { JARO_THRESHOLD } from "../../constants/suggesting-values.ts"
const KEYS_TO_SKIP: Omit<keyof Reviewable, "details">[] = [
  "id",
  "date",
  "money",
  "currency",
]

const COMPARISON_RULES: ComparisonRule["ruleName"][] = ["string-match"]
export type AssignmentScoreEntry = AssignmentRuleToAdd & { score: number }
type ScoreTableKey = string
type AssignmentScoreTable = Record<ScoreTableKey, AssignmentScoreEntry>

/**
 *
 * @example of AssignmentScoreTable
 *
 *  {
 *    "category1-paymenyKey1/paymentValue1-paymentKey2/paymentValue2": {
 *      score: 0,
 *      categoryId: "category1",
 *      minimalPayment: {
 *        "paymentKey1": {
 *          ruleName: "string-match",
 *          ruleValues: {},
 *          value:"paymentValue1"
 *        },
 *        "paymentKey2": {
 *          ruleName: "string-match",
 *          ruleValues: {},
 *          value:"paymentValue2"
 *        }
 *      }
 *    }
 *  }
 */
const assignmentScoreTable: AssignmentScoreTable = {}

export const clearAssignmentScoreTable = () => {
  for (const key in assignmentScoreTable) {
    delete assignmentScoreTable[key]
  }
}

export const getAssignmentScoreTable = () => assignmentScoreTable

const createAssignmentScoreEntry = (
  payment: PaymentDetails,
  categoryId: number,
  paymentKeyCombination: string[]
): AssignmentScoreEntry => {
  return {
    score: 0,
    categoryId,
    minimalPayment: Object.fromEntries(
      Object.entries(payment)
        .filter(([key]) => paymentKeyCombination.includes(key))
        .flatMap((entry) =>
          COMPARISON_RULES.map<[string, ComparisonRule]>((rule) => [
            entry[0],
            { ruleName: rule, ruleValues: {}, value: entry[1] },
          ])
        )
    ),
  }
}

export const getListOfPaymentCombinations = (
  payment: Partial<Assignment["payment"]>
): string[][] => {
  const paymentEntriesWithValue = Object.keys(payment).filter(
    (key) => payment[key as keyof Assignment["payment"]]
  )

  // Omitting values which will be different for every payment which does not make sense to add them to score table
  const paymentKeys = paymentEntriesWithValue.filter(
    (key) => !KEYS_TO_SKIP.includes(key)
  )

  return getListOfCombinations(paymentKeys)
}

export const createScoreTableKey = (
  categoryId: number,
  paymentKeyCombination: string[],
  payment: PaymentDetails
): ScoreTableKey =>
  `${categoryId}-${[paymentKeyCombination.map((paymentKey) => [paymentKey, payment[paymentKey]].join("/")).join("-")]}`

const addPaymentAndCategoryToAssignmentScoreTable = (
  categoryId: number,
  payment: PaymentDetails
) => {
  const paymentKeyCombinations = getListOfPaymentCombinations(payment)
  for (const paymentKeyCombination of paymentKeyCombinations) {
    // Maybe its worth to think about remodeling it from this string to object representing entries?
    const key = createScoreTableKey(categoryId, paymentKeyCombination, payment)

    assignmentScoreTable[key] ??= createAssignmentScoreEntry(
      payment,
      categoryId,
      paymentKeyCombination
    )
  }
}

/**
 *
 * Rule 1 - if assignment does not have key from comparison => false
 * Rule 2 - if assignment has at least 1 non-matching key-vale => false
 * Else return true
 */
export const compareAssignmentToAssignmentScoreEntry = (
  assignment: AssignmentToAdd,
  assignmentScoreEntry: AssignmentScoreEntry
): boolean => {
  if (assignment.categoryId !== assignmentScoreEntry.categoryId) {
    return false
  }

  for (const [
    minimalPaymentKey,
    minimalPaymentComparisonRule,
  ] of Object.entries(assignmentScoreEntry.minimalPayment)) {
    const assignmentValue =
      assignment.payment[minimalPaymentKey as keyof Assignment]
    if (!assignmentValue) {
      return false
    }
    if (minimalPaymentComparisonRule.ruleName === "string-match") {
      const jaro = jaroDistance(
        `${assignmentValue}`,
        `${minimalPaymentComparisonRule.value}`
      )

      if (jaro < JARO_THRESHOLD) {
        return false
      }
    } else {
      console.error("Using comparison rule which is not supported yet")
      return false
    }
  }
  return true
}

export const fillScoreTableWithAssignments = (
  assignments: AssignmentToAdd[]
) => {
  for (const assignment of assignments) {
    addPaymentAndCategoryToAssignmentScoreTable(
      assignment.categoryId,
      assignment.payment
    )

    const assignmentsForCategory = Object.values(assignmentScoreTable).filter(
      (assignmentScoreTableEntry) =>
        assignmentScoreTableEntry.categoryId === assignment.categoryId
    )

    for (const assignmentForCategory of assignmentsForCategory) {
      const matching = compareAssignmentToAssignmentScoreEntry(
        assignment,
        assignmentForCategory
      )

      if (matching) {
        assignmentForCategory.score += 1
      }
    }
  }
}

const findAssignmentRulesBiggerThanThreshold = (
  threshold: number
): AssignmentRuleToAdd[] => {
  const scoreTableEntries = Object.values(assignmentScoreTable)

  return scoreTableEntries.filter(
    (scoreTableEntry) => scoreTableEntry.score > threshold
  )
}

export const suggestNewAssignmentRule = (
  currentlyReviewing: Reviewable,
  categoryId: number
): AssignmentRuleToAdd[] => {
  const currentAssignment = mapRevieableToAssignmentToAdd(
    currentlyReviewing,
    categoryId
  )

  fillScoreTableWithAssignments([currentAssignment])

  return findAssignmentRulesBiggerThanThreshold(4)
}

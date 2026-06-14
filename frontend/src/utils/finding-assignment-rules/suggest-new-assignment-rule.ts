import type {
  AssignmentRuleToAdd,
  ComparisonRule,
} from "../../model/assignment-rule.ts"
import type { Reviewable } from "../../model/reviewable.ts"
import type { Assignment } from "../../model/assignment.ts"
import { mapRevieableToAssignmentToAdd } from "../../pages/organize-budget-pages/summary-budget-page/SummaryBudgetPage.tsx"
import { getListOfCombinations } from "./get-list-of-combinations.ts"
import { jaroDistance } from "./jaro-comparison.ts"
const KEYS_TO_SKIP: Omit<keyof Reviewable, "details">[] = [
  "id",
  "date",
  "money",
  "currency",
]

const COMPARISON_RULES: ComparisonRule["ruleName"][] = ["string-match"]
type AssignmentScoreEntry = AssignmentRuleToAdd & { score: number }
type AssignmentScoreTable = Record<string, AssignmentScoreEntry>

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
const createInitialAssignmentScoreEntry = (
  assignment: Assignment,
  paymentKeyCombination: string[]
): AssignmentScoreEntry => {
  const { payment, categoryId } = assignment

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
  payment: Assignment["payment"]
): string[][] => {
  const paymentEntriesWithValue = Object.entries(payment).filter(
    ([, value]) => value
  )
  // Omitting values which will be different for every payment which does not make sense to add them to score table
  const paymentKeys = Object.keys(paymentEntriesWithValue).filter(
    (key) => !KEYS_TO_SKIP.includes(key)
  )
  return getListOfCombinations(paymentKeys)
}

export const createInitialScoreTableFromAssignments = (
  assignments: Assignment[]
): AssignmentScoreTable => {
  const assignmentScoreTable: AssignmentScoreTable = {}
  for (const assignment of assignments) {
    const { payment, categoryId } = assignment
    const paymentKeyCombinations = getListOfPaymentCombinations(payment)
    for (const paymentKeyCombination of paymentKeyCombinations) {
      // Maybe its worth to think about remodeling it from this string to object representing entries?
      const key = `${categoryId}-${[paymentKeyCombination.map((paymentKey) => [paymentKey, payment[paymentKey]].join("/")).join("-")]}`

      if (assignmentScoreTable[key]) {
        assignmentScoreTable[key].score += 1
      } else {
        assignmentScoreTable[key] = createInitialAssignmentScoreEntry(
          assignment,
          paymentKeyCombination
        )
      }
    }
  }

  return assignmentScoreTable
}

/**
 *
 * Rule 1 - if assignment does not have key from comparison => false
 * Rule 2 - if assignment has at least 1 non-matching key-vale => false
 * Else return true
 */
export const compareAssignmentToAssignmentScoreEntry = (
  assignment: Assignment,
  assignmentScoreEntry: AssignmentScoreEntry
): boolean => {
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
        assignmentValue,
        minimalPaymentComparisonRule.value as string
      )

      if (jaro < 0.8) {
        return false
      }
    } else {
      console.error("Using comparison rule which is not supported yet")
      return false
    }
  }
  return true
}

// Mutation based function!!
export const fillScoreTableWithAssignments = (
  scoreTable: AssignmentScoreTable,
  assignments: Assignment[]
) => {
  const assignmentScoreEntries = Object.values(scoreTable)
  for (const assignment of assignments) {
    const assignmentsForCategory = assignmentScoreEntries.filter(
      (assignmentScoreEntry) =>
        assignmentScoreEntry.categoryId === assignment.categoryId
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

// This util is dedicated for suggesting not applying assignment rule
// TODO write assignment rule for applying
// TODO Write tests for that, it will be impossible to test it in app
export const suggestNewAssignmentRule = (
  previousAssignments: Assignment[],
  currentlyReviewing: Reviewable,
  categoryId: number
): AssignmentRuleToAdd => {
  const currentAssignment = mapRevieableToAssignmentToAdd(
    currentlyReviewing,
    categoryId
  )

  const assignmentScoreTable: Record<
    string,
    AssignmentRuleToAdd & { score: number }
  > = createInitialScoreTableFromAssignments(previousAssignments)

  fillScoreTableWithAssignments(assignmentScoreTable, previousAssignments) // Have to cache it to not loose already added assignment
  //fillScoreTableWithAssignments(assignmentScoreTable, [currentAssignment]) //

  //findAssignmentRulesBiggerThan3
}

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
type AssignmentScoreEntry = AssignmentRuleToAdd & { score: number }
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
const createInitialAssignmentScoreEntry = (
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

const createScoreTableKey = (
  categoryId: number,
  paymentKeyCombination: string[],
  payment: PaymentDetails
): ScoreTableKey =>
  `${categoryId}-${[paymentKeyCombination.map((paymentKey) => [paymentKey, payment[paymentKey]].join("/")).join("-")]}`

const addPaymentAndCategoryToAssignmentScoreTable = (
  assignmentScoreTable: AssignmentScoreTable,

  categoryId: number,
  payment: PaymentDetails
) => {
  const paymentKeyCombinations = getListOfPaymentCombinations(payment)
  for (const paymentKeyCombination of paymentKeyCombinations) {
    // Maybe its worth to think about remodeling it from this string to object representing entries?
    const key = createScoreTableKey(categoryId, paymentKeyCombination, payment)

    if (assignmentScoreTable[key]) {
      assignmentScoreTable[key].score += 1
    } else {
      assignmentScoreTable[key] = createInitialAssignmentScoreEntry(
        payment,
        categoryId,
        paymentKeyCombination
      )
    }
  }
}

export const createInitialScoreTableFromAssignments = (
  assignments: Assignment[]
): AssignmentScoreTable => {
  const assignmentScoreTable: AssignmentScoreTable = {}

  for (const assignment of assignments) {
    const { payment, categoryId } = assignment
    addPaymentAndCategoryToAssignmentScoreTable(
      assignmentScoreTable,
      categoryId,
      payment
    )
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
  assignment: AssignmentToAdd,
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
        `${assignmentValue}`,
        minimalPaymentComparisonRule.value as string
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

// Mutation based function!!
export const fillScoreTableWithAssignments = (
  assignmentScoreTable: AssignmentScoreTable,
  assignments: AssignmentToAdd[]
) => {
  const assignmentScoreEntries = Object.values(assignmentScoreTable)
  for (const assignment of assignments) {
    addPaymentAndCategoryToAssignmentScoreTable(
      assignmentScoreTable,
      assignment.categoryId,
      assignment.payment
    )

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

const findAssignmentRulesBiggerThanThreshold = (
  scoreTable: AssignmentScoreTable,
  threshold: number
): AssignmentRuleToAdd[] => {
  const scoreTableEntries = Object.values(scoreTable)

  return scoreTableEntries.filter(
    (scoreTableEntry) => scoreTableEntry.score > threshold
  )
}
// This util is dedicated for suggesting not applying assignment rule

export const suggestNewAssignmentRule = (
  previousAssignments: Assignment[],
  currentlyReviewing: Reviewable,
  categoryId: number
): AssignmentRuleToAdd[] => {
  const currentAssignment = mapRevieableToAssignmentToAdd(
    currentlyReviewing,
    categoryId
  )

  const assignmentScoreTable: Record<
    string,
    AssignmentRuleToAdd & { score: number }
  > = createInitialScoreTableFromAssignments(previousAssignments)

  fillScoreTableWithAssignments(assignmentScoreTable, previousAssignments) // Have to cache it to not loose already added assignment
  fillScoreTableWithAssignments(assignmentScoreTable, [currentAssignment]) //

  // findSamePaymentButDifferentCategory - this will be to find out if user accidentally match with different category, but will have to allow him to do it, maybe by acknowledged_wrong_assignments (new table, entities and matching)?
  // Nah, lets just reduce amount of points after normal flow
  // Need to create user diagrams for that :<
  return findAssignmentRulesBiggerThanThreshold(assignmentScoreTable, 4)
}

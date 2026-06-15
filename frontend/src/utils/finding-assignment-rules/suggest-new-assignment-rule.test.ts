import { expect, describe, it } from "vitest"
import {
  type AssignmentScoreEntry,
  compareAssignmentToAssignmentScoreEntry,
  fillScoreTableWithAssignments,
  getListOfPaymentCombinations,
  suggestNewAssignmentRule,
} from "./suggest-new-assignment-rule.ts"
import type { Assignment, PaymentDetails } from "../../model/assignment.ts"
import { v7 } from "uuid"
import {
  JARO_DISTANCE_PAIRS,
  STRING_TO_MATCH_TO_JARO_DISTANCE,
} from "./jaro-comparison.test.ts"

// looks like N: 2^N-1
const COMBINATIONS_BY_LENGTH: Record<2 | 3 | 4, number> = {
  2: 3,
  3: 7,
  4: 15,
}

describe("getListOfPaymentCombinations", () => {
  it("should work for payment with 4 keys", () => {
    const initialList = {
      key1: 1,
      key2: 2,
      key3: 3,
      key4: 4,
    } as unknown as Assignment["payment"]

    const result = getListOfPaymentCombinations(initialList)

    expect(result).toHaveLength(COMBINATIONS_BY_LENGTH[4])

    const expectedResult = [
      ["0"],
      ["1"],
      ["0", "1"],
      ["2"],
      ["0", "2"],
      ["1", "2"],
      ["0", "1", "2"],
      ["3"],
      ["0", "3"],
      ["1", "3"],
      ["0", "1", "3"],
      ["2", "3"],
      ["0", "2", "3"],
      ["1", "2", "3"],
      ["0", "1", "2", "3"],
    ]

    expect(result).toEqual(expectedResult)
  })

  it("should skip empty values", () => {
    const initialList = {
      key1: 1,
      key2: 2,
      key3: 3,
      key4: 4,
      key5: null,
      key6: undefined,
      key7: 0,
      key8: "",
    } as unknown as Assignment["payment"]

    const result = getListOfPaymentCombinations(initialList)

    expect(result).toHaveLength(COMBINATIONS_BY_LENGTH[4])
  })
})

const createMockAssignment = ({
  paymentKeyAmount = 0,
  paymentDetails = {},
}: {
  paymentKeyAmount?: number
  paymentDetails?: PaymentDetails
} = {}): Assignment => {
  return {
    summaryId: 1,
    created: null,
    categoryId: 1,
    assignmentId: Date.now() * Math.random(),
    payment: {
      id: v7(),
      date: Date.now(),
      money: 100,
      currency: "PLN",
      ...Array.from({ length: paymentKeyAmount }).reduce<PaymentDetails>(
        (acc, _, index) => {
          acc[`paymentKey${index}`] = "paymentKey"
          return acc
        },
        { ...paymentDetails }
      ),
    },
  }
}

const createMockAssignmentScoreEntry = (): AssignmentScoreEntry => {
  return {
    score: 0,
    categoryId: 1,
    minimalPayment: {
      keyForMatchingNumber: {
        value: 1,
        ruleName: "string-match",
        ruleValues: {},
      },
      keyForMatchingString: {
        value: "1",
        ruleName: "string-match",
        ruleValues: {},
      },
      keyForMatchingJaro: {
        value: STRING_TO_MATCH_TO_JARO_DISTANCE,
        ruleName: "string-match",
        ruleValues: {},
      },
    },
  }
}

describe("compareAssignmentToAssignmentScoreEntry", () => {
  const assignmentScoreEntry = createMockAssignmentScoreEntry()

  it("should return false if payment is for another category", () => {
    const assignment = createMockAssignment({
      paymentDetails: {
        keyForMatchingNumber: 1,
        keyForMatchingString: "1",
        keyForMatchingJaro: STRING_TO_MATCH_TO_JARO_DISTANCE,
      },
    })
    assignment.categoryId = 12345789
    const result = compareAssignmentToAssignmentScoreEntry(
      assignment,
      assignmentScoreEntry
    )

    expect(result).toBe(false)
  })

  it("should return false if comparison rule contains not supported rule", () => {
    const assignmentScoreEntry = createMockAssignmentScoreEntry()
    // @ts-expect-error Checking something which should not work
    assignmentScoreEntry.minimalPayment.keyForMatchingString.ruleName =
      "non-existing-ruel"
    const assignment = createMockAssignment({
      paymentDetails: {
        keyForMatchingNumber: 1,
        keyForMatchingString: "1",
        keyForMatchingJaro: STRING_TO_MATCH_TO_JARO_DISTANCE,
      },
    })
    const result = compareAssignmentToAssignmentScoreEntry(
      assignment,
      assignmentScoreEntry
    )

    expect(result).toBeFalsy()
  })

  it("should return false if payment is is missing one payment key (even if have others matching)", () => {
    const assignment = createMockAssignment({
      paymentDetails: {
        keyForMatchingNumber: 1,
        keyForMatchingString: "1",
      },
    })
    const result = compareAssignmentToAssignmentScoreEntry(
      assignment,
      assignmentScoreEntry
    )

    expect(result).toBe(false)
  })

  it("should return false if payment is not matching one payment key (even if have others matching)", () => {
    const assignment = createMockAssignment({
      paymentDetails: {
        keyForMatchingNumber: 1,
        keyForMatchingString: "1",
        keyForMatchingJaro: JARO_DISTANCE_PAIRS[47],
      },
    })
    const result = compareAssignmentToAssignmentScoreEntry(
      assignment,
      assignmentScoreEntry
    )

    expect(result).toBe(false)
  })

  it("should return true if all minimal payment keys match to payment (even if payment has more keys)", () => {
    const assignment = createMockAssignment({
      paymentDetails: {
        keyForMatchingNumber: 1,
        keyForMatchingString: "1",
        keyForMatchingJaro: JARO_DISTANCE_PAIRS[91],
      },
    })
    const result = compareAssignmentToAssignmentScoreEntry(
      assignment,
      assignmentScoreEntry
    )

    expect(result).toBeTruthy()
  })
})

describe("fillScoreTableWithAssignments", () => {
  describe("creating entries", () => {
    it("should create initial score table from 1 assignment with 3 keys", () => {
      const mockAssignment1 = createMockAssignment({ paymentKeyAmount: 4 })
      const scoreTable = {}
      fillScoreTableWithAssignments(scoreTable, [mockAssignment1])

      expect(Object.keys(scoreTable)).toHaveLength(COMBINATIONS_BY_LENGTH[4])
    })

    it("should create initial score table from 2 assignment with 3 and 4 keys", () => {
      const mockAssignment1 = createMockAssignment({
        paymentDetails: { key1: 1, key2: 2, key3: 3 },
      })
      const mockAssignment2 = createMockAssignment({
        paymentDetails: { key4: 4, key5: 5, key6: 6, key7: 7 },
      })
      const scoreTable = {}

      fillScoreTableWithAssignments(scoreTable, [
        mockAssignment1,
        mockAssignment2,
      ])

      expect(Object.keys(scoreTable)).toHaveLength(
        COMBINATIONS_BY_LENGTH[4] + COMBINATIONS_BY_LENGTH[3]
      )
    })

    it("should increment score if key&value combination within payments are the same instead of creating new entry - same values and same keys", () => {
      const mockAssignment1 = createMockAssignment({
        paymentDetails: {
          uniqueKey1: 1,
          collisionKey: 1,
        },
      })

      const mockAssignment2 = createMockAssignment({
        paymentDetails: {
          uniqueKey2: 2,
          collisionKey: 1,
        },
      })
      const scoreTable = {}

      fillScoreTableWithAssignments(scoreTable, [
        mockAssignment1,
        mockAssignment2,
      ])

      expect(Object.keys(scoreTable)).toHaveLength(5)
      expect(Object.keys(scoreTable).sort()).toEqual([
        "1-collisionKey/1",
        "1-uniqueKey1/1",
        "1-uniqueKey1/1-collisionKey/1",
        "1-uniqueKey2/2",
        "1-uniqueKey2/2-collisionKey/1",
      ])
    })

    it("should increment score if key&value combination within payments are the same instead of creating new entry - different values but same keys", () => {
      const mockAssignment1 = createMockAssignment({
        paymentDetails: {
          uniqueKey1: 1,
          collisionKey: 1,
        },
      })
      //
      const mockAssignment2 = createMockAssignment({
        paymentDetails: {
          uniqueKey1: 2,
          collisionKey: -1,
        },
      })

      const scoreTable = {}
      fillScoreTableWithAssignments(scoreTable, [
        mockAssignment1,
        mockAssignment2,
      ])

      expect(Object.keys(scoreTable)).toHaveLength(6)
      expect(Object.keys(scoreTable).sort()).toEqual([
        "1-collisionKey/-1",
        "1-collisionKey/1",
        "1-uniqueKey1/1",
        "1-uniqueKey1/1-collisionKey/1",
        "1-uniqueKey1/2",
        "1-uniqueKey1/2-collisionKey/-1",
      ])
    })
  })
})
describe("suggestNewAssignmentRule", () => {})

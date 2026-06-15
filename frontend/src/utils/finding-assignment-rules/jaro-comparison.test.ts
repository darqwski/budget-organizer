import { expect, describe, it } from "vitest"
import { jaroDistance } from "./jaro-comparison.ts"

export const STRING_TO_MATCH_TO_JARO_DISTANCE =
  "Very long string which is mostly matching"
export const JARO_DISTANCE_PAIRS = {
  75: "Quite long string which is not matching mostly",
  47: "Not matching hehe",
  91: "Very long string which is not mostly matching",
}
describe("jaro-distance", () => {
  it("should work for 0.75", () => {
    expect(
      jaroDistance(STRING_TO_MATCH_TO_JARO_DISTANCE, JARO_DISTANCE_PAIRS[75])
    ).toBeLessThan(0.76)
    expect(
      jaroDistance(STRING_TO_MATCH_TO_JARO_DISTANCE, JARO_DISTANCE_PAIRS[75])
    ).toBeGreaterThan(0.74)
  })
  it("should work for 0.47", () => {
    expect(
      jaroDistance(STRING_TO_MATCH_TO_JARO_DISTANCE, JARO_DISTANCE_PAIRS[47])
    ).toBeLessThan(0.48)
    expect(
      jaroDistance(STRING_TO_MATCH_TO_JARO_DISTANCE, JARO_DISTANCE_PAIRS[47])
    ).toBeGreaterThan(0.46)
  })
  it("should work for 0.91", () => {
    expect(
      jaroDistance(STRING_TO_MATCH_TO_JARO_DISTANCE, JARO_DISTANCE_PAIRS[91])
    ).toBeLessThan(0.9)
    expect(
      jaroDistance(STRING_TO_MATCH_TO_JARO_DISTANCE, JARO_DISTANCE_PAIRS[91])
    ).toBeGreaterThan(0.92)
  })
})

import { pool } from "../connection"
import { User } from "../../model/users"
import { snakeToCamel } from "../../utils/snake-to-camel"
import { SuggestAssignmentsConfig } from "./update-suggest-assignments-config"

export const getSuggestAssignmentConfig = async (
  user: User
): Promise<SuggestAssignmentsConfig> => {
  try {
    const result = await pool.query(
      "SELECT suggest_assignments_config_id, user_id, banned_keys FROM suggest_assignments_config WHERE user_id = $1",
      [user.userId]
    )

    return result.rows.map((row) => {
      return Object.entries(row).reduce((acc, [key, value]) => {
        // @ts-expect-error TS is too hard, it should work
        acc[snakeToCamel(key)] = value
        return acc
      }, {} as SuggestAssignmentsConfig)
    })[0]
  } catch (error) {
    throw error
  }
}

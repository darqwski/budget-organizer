import { pool } from "../connection"
import { User } from "../../model/users"
import { snakeToCamel } from "../../utils/snake-to-camel"
import { Assignment } from "../../model/assignment"

export const getAssignmentsFromDB = async (
  user: User
): Promise<Assignment[]> => {
  try {
    const result = await pool.query(
      "SELECT assignment_id, user_id, summary_id, category_id, payment, created FROM assignments WHERE user_id = $1",
      [user.userId]
    )

    return result.rows.map((row) => {
      return Object.entries(row).reduce((acc, [key, value]) => {
        // @ts-expect-error TS is too hard, it should work
        acc[snakeToCamel(key)] = value
        return acc
      }, {} as Assignment)
    })
  } catch (error) {
    throw error
  }
}

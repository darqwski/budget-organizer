import { pool } from "../connection"
import { Category } from "../../model/categories"
import { User } from "../../model/users"
import { CATEGORY_STATUS } from "../../constants/category"
import { Summary } from "../../model/summary"
import { snakeToCamel } from "../../utils/snake-to-camel"

// summary_id SERIAL PRIMARY KEY,
//   user_id VARCHAR(128) NOT NULL,
//   title VARCHAR(256),
//   description varchar(2048),
//   entries json,
//   balance NUMERIC(12, 2),
//   original_limits_exceeded integer,
//   original_limits_met integer,
//   current_limits_exceeded integer,
//   current_limits_met integer,
//   created timestamp NOT NULL

export const getSummariesFromDB = async (user: User): Promise<Summary[]> => {
  try {
    const result = await pool.query(
      "SELECT summary_id, title, description, entries, balance, original_limits_exceeded, original_limits_met, current_limits_exceeded, current_limits_met, created FROM summaries WHERE user_id = $1",
      [user.userId]
    )

    return result.rows.map((row) => {
      return Object.entries(row).reduce((acc, [key, value]) => {
        // @ts-expect-error TS is too hard, it should work
        acc[snakeToCamel(key)] = value
        return acc
      }, {} as Summary)
    })
  } catch (error) {
    throw error
  }
}

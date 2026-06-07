import { Category } from "../../model/categories"
import { pool } from "../connection"
import { Summary } from "../../model/summary"

export const insertSummaryIntoDB = async (
  summary: Summary
): Promise<Category[]> => {
  try {
    const result = await pool.query(
      `
    INSERT INTO products (
      user_id, title, description, entries, balance, original_limits_exceeded, original_limits_met, current_limits_exceeded, current_limits_met, timestamp
    ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP()
             );
`,
      [
        summary.user.id,
        summary.title,
        summary.description,
        summary.entries,
        summary.balance,
        summary.originalLimitsExceeded,
        summary.originalLimitsMet,
        summary.currentLimitsExceeded,
        summary.currentLimitsMet,
      ]
    )

    return result.rows
  } catch (error) {
    throw error
  }
}

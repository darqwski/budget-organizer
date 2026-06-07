import { Category } from "../../model/categories"
import { pool } from "../connection"
import { Summary } from "../../model/summary"

export const insertSummaryIntoDB = async (
  summary: Summary
): Promise<Category[]> => {
  try {
    console.log({ summary })
    const result = await pool.query(
      `INSERT INTO summaries (user_id, title, description, entries, balance, original_limits_exceeded, original_limits_met, current_limits_exceeded, current_limits_met, created) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, current_timestamp);`,
      [
        summary.user.userId,
        summary.title,
        summary.description,
        JSON.stringify(summary.entries),
        summary.balance,
        summary.originalLimitsExceeded,
        summary.originalLimitsMet,
        summary.currentLimitsExceeded,
        summary.currentLimitsMet,
      ]
    )

    console.log({ result })
    return result.rows
  } catch (error) {
    throw error
  }
}

import { pool } from "../connection"
import { User } from "../../model/users"

export const getUserByUsernameAndPasswordFromDB = async (
  username: string,
  hashedPassword: string
): Promise<User | null> => {
  try {
    const result = await pool.query(
      "SELECT user_id, username, created, role FROM users WHERE username = $1 AND password = $2",
      [username, hashedPassword]
    )

    if (result.rows.length !== 1) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    throw error
  }
}

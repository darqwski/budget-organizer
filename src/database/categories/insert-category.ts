import { User } from "../../model/users"
import { CategoryToAdd } from "../../model/categories"
import { pool } from "../connection"
import { CATEGORY_STATUS } from "../../constants/category"

export const insertCategoryIntoDB = async (
  user: User,
  category: CategoryToAdd
): Promise<void> => {
  try {
    const result = await pool.query(
      `INSERT INTO categories (user_id, name, status, created) VALUES ($1, $2, $3, current_timestamp);`,
      [user.userId, category.name, CATEGORY_STATUS.active]
    )
  } catch (error) {
    throw error
  }
}

import { User } from "../../model/users"
import { Category } from "../../model/categories"
import { pool } from "../connection"
import { CATEGORY_STATUS } from "../../constants/category"

export const insertCategoryIntoFromDB = async (
  user: User,
  category: Category
): Promise<Category[]> => {
  try {
    const result = await pool.query(
      `INSERT INTO categories (user_id, name, status, created) VALUES ($1, $2, $3, current_timestamp);`,
      [user.userId, category.name, CATEGORY_STATUS.active]
    )

    return result.rows.map((row) => {
      const { category_id: categoryId, ...rest } = row

      return { ...rest, categoryId }
    })
  } catch (error) {
    throw error
  }
}

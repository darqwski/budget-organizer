import { User } from "../../model/users"
import { Category } from "../../model/categories"
import { pool } from "../connection"
import { CATEGORY_STATUS } from "../../constants/category"

export const archiveCategoryInDB = async (
  user: User,
  category: Category
): Promise<Category[]> => {
  try {
    const result = await pool.query(
      `UPDATE categories
       SET status = $1
       WHERE user_id = $2 AND category_id = $3;`,
      [CATEGORY_STATUS.archived, user.userId, category.name]
    )

    return result.rows.map((row) => {
      const { category_id: categoryId, ...rest } = row

      return { ...rest, categoryId }
    })
  } catch (error) {
    throw error
  }
}

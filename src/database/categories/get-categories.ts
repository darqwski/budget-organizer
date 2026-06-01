import { pool } from "../connection"
import { Category } from "../../model/categories"

export const getCategories = async (): Promise<Category[]> => {
  try {
    const result = await pool.query("SELECT * FROM categories")

    return result.rows
  } catch (error) {
    throw error
  }
}

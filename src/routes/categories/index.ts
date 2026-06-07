import { Request, Response, NextFunction, Router } from "express"
import { getActiveCategoriesFromDB } from "../../database/categories/get-categories"
import { getUserFromRequest } from "../../utils/cookies"
import { Category, CategoryToAdd } from "../../model/categories"
import { insertCategoryIntoDB } from "../../database/categories/insert-category"
import { archiveCategoryInDB } from "../../database/categories/archive-category"

const router = Router()

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const user = getUserFromRequest(req)
  if (!user) {
    return next({ status: 401, statusText: "Unauthorized" })
  }

  try {
    const categories = await getActiveCategoriesFromDB(user)
    res.json(categories)
  } catch (error) {
    next(error)
  }
})

router.post(
  "/",
  async (
    req: Request<any, any, { categoriesToAdd: CategoryToAdd[] }>,
    res: Response,
    next: NextFunction
  ) => {
    const user = getUserFromRequest(req)
    if (!user) {
      return next({ status: 401, statusText: "Unauthorized" })
    }
    const { categoriesToAdd } = req.body

    try {
      for (const categoryToAdd of categoriesToAdd) {
        await insertCategoryIntoDB(user, categoryToAdd)
      }
      res.json({ message: `Added ${categoriesToAdd.length} item(s)` })
    } catch (error) {
      next(error)
    }
  }
)

router.delete(
  "/",
  async (
    req: Request<any, any, { category: Category }>,
    res: Response,
    next: NextFunction
  ) => {
    const user = getUserFromRequest(req)
    if (!user) {
      return next({ status: 401, statusText: "Unauthorized" })
    }
    const { category } = req.body

    try {
      const categories = await archiveCategoryInDB(user, category)
      res.json(categories)
    } catch (error) {
      next(error)
    }
  }
)

export default router

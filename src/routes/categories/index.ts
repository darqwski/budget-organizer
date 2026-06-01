import { Request, Response, NextFunction, Router } from "express"
import { getCategories } from "../../database/categories/get-categories"

const router = Router()

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await getCategories()
    res.json(categories)
  } catch (error) {
    next(error)
  }
})

export default router

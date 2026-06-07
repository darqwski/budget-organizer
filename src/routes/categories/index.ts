import { Request, Response, NextFunction, Router } from "express"
import { getActiveCategoriesFromDB } from "../../database/categories/get-categories"
import { getUserFromRequest } from "../../utils/cookies"

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

export default router

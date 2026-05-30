import { Request, Response, NextFunction, Router } from "express"

const router = Router()

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json([])
  } catch (error) {
    next(error)
  }
})

export default router

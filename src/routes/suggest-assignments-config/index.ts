import { Request, Response, NextFunction, Router } from "express"
import { getUserFromRequest } from "../../utils/cookies"
import { AssignmentToAdd } from "../../model/assignment"
import { insertAssignmentsIntoDB } from "../../database/assignments/add-assignments"
import { getAssignmentsFromDB } from "../../database/assignments/get-assignments"
import { SuggestAssignmentsConfig } from "../../model/suggest-assignments-config"
import { updateOrInsertSuggestAssignmentConfigIntoDB } from "../../database/suggest-assignments-config/update-or-insert-suggest-assignments-config"
import { getSuggestAssignmentConfigFromDB } from "../../database/suggest-assignments-config/get-suggest-assignments-config"

const suggestAssignmentsConfigRouter = Router()

suggestAssignmentsConfigRouter.post(
  "/",
  async (
    req: Request<any, any, Partial<SuggestAssignmentsConfig>>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = getUserFromRequest(req)

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" })
      }
      const config = req.body

      const insertedConfigId =
        await updateOrInsertSuggestAssignmentConfigIntoDB(config, user)

      res.status(200).json({ insertedConfigId })
    } catch (error) {
      next(error)
    }
  }
)

suggestAssignmentsConfigRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = getUserFromRequest(req)

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const suggestAssignmentConfig =
        await getSuggestAssignmentConfigFromDB(user)

      res.status(200).json(suggestAssignmentConfig)
    } catch (error) {
      next(error)
    }
  }
)

export default suggestAssignmentsConfigRouter

import { Request, Response, NextFunction, Router } from "express"
import { getUserFromRequest } from "../../utils/cookies"
import { getSummariesFromDB } from "../../database/summaries/get-summaries"
import { AssignmentToAdd } from "../../model/assignment"
import { insertAssignmentsIntoDB } from "../../database/assignments/add-assignments"
import { getAssignmentsFromDB } from "../../database/assignments/get-assignments"

const router = Router()

router.post(
  "/",
  async (
    req: Request<
      any,
      any,
      { assignmentsToAdd: AssignmentToAdd[]; summaryId: number }
    >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = getUserFromRequest(req)
      const { assignmentsToAdd, summaryId } = req.body

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" })
      }
      const insertedAssignments = insertAssignmentsIntoDB(
        assignmentsToAdd,
        summaryId,
        user
      )

      res.status(200).json({ insertedAssignments })
    } catch (error) {
      next(error)
    }
  }
)

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getUserFromRequest(req)

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const assignments = await getAssignmentsFromDB(user)

    res.status(200).json(assignments)
  } catch (error) {
    next(error)
  }
})

export default router

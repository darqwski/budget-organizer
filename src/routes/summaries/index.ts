import { Request, Response, NextFunction, Router } from "express"
import { getActiveCategoriesFromDB } from "../../database/categories/get-categories"
import { getUserFromRequest } from "../../utils/cookies"
import {
  Summary,
  SummaryEntry,
  SummaryToAdd,
  SummaryValues,
} from "../../model/summary"
import { Category } from "../../model/categories"
import { User } from "../../model/users"
import { insertSummaryIntoDB } from "../../database/summaries/add-summary"
import { getSummariesFromDB } from "../../database/summaries/get-summaries"

const router = Router()

const calculateSummaryValues = (entries: SummaryEntry[]): SummaryValues => {
  return entries.reduce<SummaryValues>(
    (acc, entry) => {
      acc.balance += entry.value

      return acc
    },
    {
      originalLimitsExceeded: 0,
      originalLimitsMet: 0,
      currentLimitsExceeded: 0,
      currentLimitsMet: 0,
      balance: 0,
    }
  )
}

const mapSummaryToAddToSummary = (
  summaryToAdd: SummaryToAdd,
  user: User,
  categories: Category[]
): Summary => {
  const categoriesById: Record<string, Category> = Object.fromEntries(
    categories.map((category) => [category.categoryId, category])
  )

  console.log("categoriesById", categoriesById)
  const entries: SummaryEntry[] = summaryToAdd.entries.map((entry) => {
    const category = categoriesById[entry.category.categoryId]

    return {
      originalCategory: category,
      currentCategory: category,
      value: entry.value,
    }
  })

  const summaryValues = calculateSummaryValues(entries)

  return {
    created: null,
    summaryId: null,
    user: user,
    entries,
    title: summaryToAdd.title,
    description: summaryToAdd.description,
    ...summaryValues,
  }
}

router.post(
  "/",
  async (
    req: Request<any, any, { summaryToAdd: SummaryToAdd }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = getUserFromRequest(req)
      const { summaryToAdd } = req.body

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" })
      }
      const categories = await getActiveCategoriesFromDB(user)

      console.log("categories for mapping summary", categories.length)
      const summary = mapSummaryToAddToSummary(summaryToAdd, user, categories)

      const summaryId = await insertSummaryIntoDB(summary)

      res.status(200).json({ summaryId })
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
    const summaries = await getSummariesFromDB(user)

    res.status(200).json(summaries)
  } catch (error) {
    next(error)
  }
})

export default router

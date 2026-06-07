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
    categories.map((category) => [category, category.categoryId])
  )
  console.log({ summaryToAdd })
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
  "/add",
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

      const summary = mapSummaryToAddToSummary(summaryToAdd, user, categories)

      await insertSummaryIntoDB(summary)

      res.status(200).json({ message: "Success" })
    } catch (error) {
      next(error)
    }
  }
)

export default router

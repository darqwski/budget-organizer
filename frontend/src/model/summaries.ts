import type { Category } from "./categories.ts"
import type { User } from "./users.ts"

export interface SummaryEntry {
  originalCategory: Category
  currentCategory: Category
  value: number
}

export interface Summary {
  summaryId: number
  title: string
  user: User
  description: string
  entries: SummaryEntry[]
  balance: number
  originalLimitsExceeded: number
  originalLimitsMet: number
  currentLimitsExceeded: number
  currentLimitsMet: number
  created: number
}

export interface SummaryEntryToAdd {
  category: Category
  value: number
}

export interface SummaryToAdd {
  title: string
  description: string
  entries: SummaryEntryToAdd[]
}

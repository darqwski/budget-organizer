// summary_id SERIAL PRIMARY KEY,
//   user_id VARCHAR(128) NOT NULL,
//   title VARCHAR(256),
//   description varchar(2048),
//   entries json,
//   balance NUMERIC(12, 2),
//   original_limits_exceeded integer,
//   original_limits_met integer,
//   current_limits_exceeded integer,
//   current_limits_met integer,
//   created timestamp NOT NULL

import { User } from "./users"
import { Category } from "./categories"

export interface SummaryEntry {
  originalCategory: Category
  currentCategory: Category
  value: number
}

export interface SummaryValues {
  originalLimitsExceeded: number
  originalLimitsMet: number
  currentLimitsExceeded: number
  currentLimitsMet: number
  balance: number
}

export interface Summary extends SummaryValues {
  summaryId: number | null
  user: User
  title: string
  description: string
  entries: SummaryEntry[]
  created: number | null
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

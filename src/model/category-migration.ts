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

export interface CategoryMigration {
  summaryId: number
  user: User
  originalCategoryId: number
  currentCategoryId: number
  reason: string
  created: number
}

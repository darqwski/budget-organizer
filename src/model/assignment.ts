//  assignment_id SERIAL PRIMARY KEY,
//   user_id VARCHAR(128) NOT NULL,
//   summary_id VARCHAR(256) NOT NULL,
//   category_id varchar(2048) NOT NULL,
//   payment json,
//   created timestamp NOT NULL
import { User } from "./users"

export interface Assignment {
  assignmentId: number
  user: User
  summaryId: number
  categoryId: number
  payment: Record<string, string>
  created: number | null
}
export interface AssignmentToAdd {
  summaryId: number
  categoryId: number
  payment: Record<string, string>
}

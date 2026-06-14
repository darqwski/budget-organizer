import { http } from "./http.ts"
import type {} from "../model/summaries.ts"
import type { Assignment, AssignmentToAdd } from "../model/assignment.ts"

export const fetchAssignments = async (): Promise<Assignment[]> => {
  const { data } = await http.get<Assignment[]>("/assignments")

  return data
}

export const addAssignments = async (
  assignmentsToAdd: AssignmentToAdd[]
): Promise<number> => {
  const { data } = await http.post<{ insertedAssignments: number }>(
    "/assignments",
    {
      assignmentsToAdd,
    }
  )

  return data.insertedAssignments
}

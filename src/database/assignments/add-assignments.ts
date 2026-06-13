import { Category } from "../../model/categories"
import { pool } from "../connection"
import { Summary } from "../../model/summary"
import { Assignment, AssignmentToAdd } from "../../model/assignment"
import { User } from "../../model/users"

const ASSIGNMENT_BATCH_SIZE = 1000

export const insertAssignmentsIntoDB = async (
  assignments: AssignmentToAdd[],
  summaryId: number,
  user: User
): Promise<number> => {
  const assignmentBatches = assignments.reduce<AssignmentToAdd[][]>(
    (acc, item) => {
      const batchIndex = acc.length - 1

      // First assignment need to create batch
      if (batchIndex === -1) {
        return [[item]]
      }

      // When next is reached, create new batch
      if (acc[batchIndex].length + 1 >= ASSIGNMENT_BATCH_SIZE) {
        acc.push([item])

        return acc
      }

      // When there is still place in batch, just add to current one
      acc[batchIndex].push(item)

      return acc
    },
    []
  )

  try {
    let addedRows = 0
    for (const batch of assignmentBatches) {
      const listOfParameters = batch.map((assignment) => [
        user.userId,
        summaryId,
        assignment.categoryId,
        assignment.payment,
        Date.now(),
      ])

      let counter = 0
      let valuesList: string[] = []
      for (const parameters of listOfParameters) {
        const values = []
        for (const parameter of parameters.entries()) {
          values.push(`$${counter}`)
          counter += 1
        }
        valuesList.push(`(${values.join(", ")})`)
      }

      const result = await pool.query(
        `INSERT INTO assignments (user_id, summary_id, category_id, payment, created) VALUES ${valuesList.join(" ,")};`,
        listOfParameters.flat()
      )
      const { rows, ...rest } = result
      console.log("Added rows: ", rows.length)
      addedRows += rows.length

      if (result.rows.length !== batch.length) {
        console.log(JSON.stringify(rest))
        throw new Error("Not all assignments added to database")
      }
    }

    return addedRows
  } catch (error) {
    throw error
  }
}

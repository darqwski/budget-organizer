import { User } from "../../model/users"
import { getSuggestAssignmentConfigFromDB } from "./get-suggest-assignments-config"
import { pool } from "../connection"
import { SuggestAssignmentsConfig } from "../../model/suggest-assignments-config"

const ALLOWED_KEYS: Record<string, string | undefined> = {
  bannedKeys: "banned_keys",
}

const mapEntriesToUpdateQuery = (
  entries: [string, string[] | number][]
): string => {
  return entries
    .filter(([key]) => key)
    .map(([key], index) => `${key} = $${index + 2}`)
    .join(", ")
}

export const updateOrInsertSuggestAssignmentConfigIntoDB = async (
  newConfig: Partial<SuggestAssignmentsConfig>,
  user: User
): Promise<number> => {
  const currentConfig = await getSuggestAssignmentConfigFromDB(user)

  const sanitizedEntries: [string, string[] | number][] = Object.entries(
    newConfig
  )
    .filter(([key]) => ALLOWED_KEYS[key])
    .map((entry) => [ALLOWED_KEYS[entry[0]] as string, entry[1]])

  if (!sanitizedEntries.length) {
    throw new Error("Nothing to be updated")
  }

  console.log({ currentConfig })
  if (currentConfig) {
    const query = `UPDATE suggest_assignments_config SET ${mapEntriesToUpdateQuery(sanitizedEntries)} WHERE suggest_assignments_config_id = $1`
    console.log("Update query", query)

    const result = await pool.query(query, [
      currentConfig.suggestAssignmentsConfigId,
      ...sanitizedEntries.map((entry) => JSON.stringify(entry[1])),
    ])

    console.log("Update result", result)

    return currentConfig.suggestAssignmentsConfigId
  } else {
    const query = `INSERT INTO suggest_assignments_config (user_id, ${sanitizedEntries.map(([key]) => key)}) VALUES ($1, ${sanitizedEntries.map((_, index) => `$${index + 2}`).join(", ")}) RETURNING suggest_assignments_config_id;`
    console.log(query)
    console.log("Update query", query)

    const result = await pool.query(query, [
      user.userId,
      ...sanitizedEntries.map((entry) => JSON.stringify(entry[1])),
    ])

    console.log(result)

    const newId = result.rows[0]?.suggest_assignments_config_id as
      | number
      | undefined
    if (!newId) {
      throw new Error("Unable to add new suggest assignments config")
    }
    return newId
  }
}

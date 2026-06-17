import { User } from "../../model/users"

export interface SuggestAssignmentsConfig {
  suggestAssignmentsConfigId: number
  bannedKeys: string[]
}

export const updateSuggestAssignmentConfig = async (
  newConfig: SuggestAssignmentsConfig,
  user: User
): Promise<void> => {
  // User will have only one config
}

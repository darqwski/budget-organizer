import { http } from "./http.ts"
import type { SuggestAssignmentsConfig } from "../model/suggest-assignments-config.ts"

export const fetchSuggestAssignmentsConfig =
  async (): Promise<SuggestAssignmentsConfig | null> => {
    const { data } = await http.get<SuggestAssignmentsConfig | null>(
      "/suggest-assignments-config"
    )

    return data
  }

export const updateSuggestAssignmentsConfig = async (
  suggestAssignmentsConfig: Partial<SuggestAssignmentsConfig>
): Promise<number> => {
  const { data } = await http.post<{ suggestAssignmentsConfigId: number }>(
    "/suggest-assignments-config",
    suggestAssignmentsConfig
  )

  return data.suggestAssignmentsConfigId
}

import { http } from "./http.ts"
import type { Summary, SummaryToAdd } from "../model/summaries.ts"

export const fetchSummaries = async (): Promise<Summary[]> => {
  const { data } = await http.get<Summary[]>("/summaries")

  return data
}

export const addSummaries = async (
  summaryToAdd: SummaryToAdd
): Promise<number> => {
  const { data } = await http.post<{ summaryId: number }>("/summaries/", {
    summaryToAdd,
  })

  return data.summaryId
}

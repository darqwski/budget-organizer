import { http } from "./http.ts"
import type { Summary } from "../model/summaries.ts"

export const fetchSummaries = async (): Promise<Summary[]> => {
  const { data } = await http.get<Summary[]>("/summaries")

  return data
}

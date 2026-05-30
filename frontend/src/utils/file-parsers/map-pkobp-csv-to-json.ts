import type { Reviewable } from "../../model/reviewable.ts"
import { csvToJSON } from "./csv-to-json.ts"

export const mapPKOBPCSVToJson = async (file: File): Promise<Reviewable[]> => {
  const text = await file.text()
  const csvRows = csvToJSON(text)

  return csvRows.map<Reviewable>((csvRow) => {
    return csvRow
  })
}

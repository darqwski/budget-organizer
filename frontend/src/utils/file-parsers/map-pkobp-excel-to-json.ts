import type { Reviewable } from "../../model/reviewable.ts"
import { excelToJson } from "./excel-to-json.ts"

export const mapPKOBPExcelToJson = async (
  file: File
): Promise<Reviewable[]> => {
  const excelRows: unknown[] = await new Promise((resolve) => {
    excelToJson(file, 0, resolve)
  })

  return excelRows.map((excelRow) => {
    return excelRow
  })
}

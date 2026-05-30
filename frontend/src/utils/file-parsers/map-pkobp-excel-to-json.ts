import type { Reviewable } from "../../model/reviewable.ts"
import { excelToJson } from "./excel-to-json.ts"

export const mapPKOBPExcelToJson = async (
  file: File
): Promise<Reviewable[]> => {
  const excelRows: Record<string, string>[] = await new Promise((resolve) => {
    excelToJson(file, 0, resolve)
  })

  return excelRows
    .filter((excelRow) => excelRow.Kwota)
    .map((excelRow) => {
      const {
        __EMPTY_4,
        "Opis transakcji": transaction,
        Kwota,
        __EMPTY,
        Waluta,
      } = excelRow
      const [, date] = (__EMPTY_4 || "").split(" : ")
      return {
        date: new Date(date),
        id: transaction,
        money: Number(Kwota),
        name: __EMPTY,
        description: "",
        details: excelRow,
        currency: Waluta,
      }
    })
}

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
        "Opis transakcji": transaction,
        Kwota,
        "Data operacji": date,
        __EMPTY,
        Waluta,
      } = excelRow
      console.log({ date })
      if (!date) {
        console.log(excelRow)
      }
      return {
        date: date ? new Date(date) : null,
        id: transaction,
        money: Number(Kwota),
        name: __EMPTY,
        description: "",
        details: excelRow,
        currency: Waluta,
      }
    })
}

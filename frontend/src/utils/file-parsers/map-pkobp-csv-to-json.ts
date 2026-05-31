import type { Reviewable } from "../../model/reviewable.ts"
import { csvToJSON } from "./csv-to-json.ts"

export const mapPKOBPCSVToJson = async (file: File): Promise<Reviewable[]> => {
  const text = await file.text()
  const csvRows = csvToJSON(text)

  return csvRows.map<Reviewable>((csvRow) => {
    const {
      "Data operacji": date,
      "Opis transakcji": transaction,
      Kwota: money,
      Waluta: currency,
      ...rest
    } = csvRow
    return {
      id: transaction,
      date: new Date(date),
      currency,
      money: Number(money),
      details: {
        ...rest,
        transaction,
      },
    }
  })
}

import type { Reviewable } from "../../model/reviewable.ts"
import { csvToJSON } from "./csv-to-json.ts"

export const mapPKOBPCSVToJson = async (file: File): Promise<Reviewable[]> => {
  const text = await file.text()
  const csvRows = csvToJSON(text)

  return csvRows.map<Reviewable>((csvRow) => {
    console.log(JSON.stringify(csvRow))
    const {
      "Data operacji": date,
      "Opis transakcji": transaction,
      Kwota: money,
      Name7: name,
      Waluta: currency,
    } = csvRow
    return {
      id: transaction,
      name,
      date: new Date(date),
      description: "",
      currency,
      money: Number(money),
      details: csvRow,
    }
  })
}

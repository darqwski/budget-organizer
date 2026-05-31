import * as XLSX from "xlsx"

export const excelToJson = (
  file: File,
  sheetIndex: number,
  onLoadCallback: (json: Record<string, string>[]) => void
) => {
  const reader = new FileReader()
  reader.onload = function (e) {
    if (!e.target) {
      throw new Error("Unable to read file - sorry")
    }

    // Convert the data to a workbook
    const workbook = XLSX.read(e.target.result, { type: "binary" })

    const sheet = workbook.Sheets[workbook.SheetNames[sheetIndex]]

    const jsonData: Record<string, string>[] = XLSX.utils.sheet_to_json(sheet, {
      raw: false,
    })

    onLoadCallback(jsonData)
  }

  reader.readAsArrayBuffer(file)
}

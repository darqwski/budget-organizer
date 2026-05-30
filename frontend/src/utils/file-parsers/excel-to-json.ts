import * as XLSX from "xlsx"

export const excelToJson = (
  file: File,
  sheetIndex: number,
  onLoadCallback: (json: unknown[]) => void
) => {
  const reader = new FileReader()
  reader.onload = function (e) {
    if (!e.target) {
      throw new Error("Unable to read file - sorry")
    }

    // Convert the data to a workbook
    const workbook = XLSX.read(e.target.result, { type: "binary" })

    const sheet = workbook.Sheets[workbook.SheetNames[sheetIndex]]

    const jsonData = XLSX.utils.sheet_to_json(sheet)

    onLoadCallback(jsonData)
  }

  reader.readAsArrayBuffer(file)
}

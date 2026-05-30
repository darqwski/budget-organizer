export const csvToJSON = (csv: string): unknown[] => {
  const lines = csv.split("\n")

  const result = []

  const headers = lines[0].split(",")

  for (let i = 1; i < lines.length; i++) {
    const obj = {}
    const currentLine = lines[i].split(",")

    for (let j = 0; j < headers.length; j++) {
      // @ts-expect-error I will type it someday
      obj[headers[j]] = currentLine[j]
    }

    result.push(obj)
  }

  return result
}

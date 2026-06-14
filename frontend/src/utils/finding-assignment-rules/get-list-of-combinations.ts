export const getListOfCombinations = (list: string[]): string[][] => {
  const res = []
  const total = Math.pow(2, list.length)

  for (let i = 1; i < total; i++) {
    const comb = []
    for (let j = 0; j < list.length; j++) {
      if (i & (1 << j)) {
        // WTF?
        comb.push(list[j])
      }
    }
    res.push(comb)
  }
  return res
}

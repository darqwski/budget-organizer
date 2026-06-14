export const jaroDistance = (stringA: string, stringB: string): number => {
  // If the strings are equal
  if (stringA === stringB) return 1.0

  if (stringA.length == 0 || stringB.length == 0) return 0.0

  // Maximum distance upto which matching
  // is allowed
  const maxDistance =
    Math.floor(Math.max(stringA.length, stringB.length) / 2) - 1

  // Count of matches
  let match = 0

  // Hash for matches
  let hashStringA = new Array(stringA.length)
  hashStringA.fill(0)
  let hashStringB = new Array(stringB.length)
  hashStringB.fill(0)

  // Traverse through the first string
  for (let i = 0; i < stringA.length; i++) {
    // Check if there is any matches
    for (
      let j = Math.max(0, i - maxDistance);
      j < Math.min(stringB.length, i + maxDistance + 1);
      j++
    )
      // If there is a match
      if (stringA[i] == stringB[j] && hashStringB[j] == 0) {
        hashStringA[i] = 1
        hashStringB[j] = 1
        match++
        break
      }
  }

  // If there is no match
  if (match == 0) {
    return 0.0
  }

  // Number of transpositions
  let t = 0

  let point = 0

  // Count number of occurrences
  // where two characters match but
  // there is a third matched character
  // in between the indices
  for (let i = 0; i < stringA.length; i++) {
    if (hashStringA[i] == 1) {
      // Find the next matched character
      // in second string
      while (hashStringB[point] == 0) {
        point++
      }

      if (stringA[i] !== stringB[point++]) {
        t++
      }
    }
  }
  t /= 2

  // Return the Jaro Similarity
  return (
    (match / stringA.length + match / stringB.length + (match - t) / match) /
    3.0
  )
}

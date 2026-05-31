export const formatDate = (date: Date | null): string | null => {
  if (!date) {
    return null
  }

  try {
    return new Intl.DateTimeFormat("pl-PL", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(date)
  } catch (e) {
    console.log({ date })
    console.error(e)
    return "Date error"
  }
}

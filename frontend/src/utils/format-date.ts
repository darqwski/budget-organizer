export const formatDate = (date: Date | null): string | null => {
  if (!date) {
    return null
  }

  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(date)
}

export const formatDate = (date: Date | null) => {
  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(date)
}

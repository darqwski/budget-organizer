export const formatMoney = (money: number, currency?: string) => {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: currency || "PLN",
  }).format(money)
}

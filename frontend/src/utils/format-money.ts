export const formatMoney = (money: number, currency: string = "PLN") => {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
  }).format(money)
}

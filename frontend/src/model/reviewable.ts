export interface Reviewable {
  id: string
  date: number | null
  money: number
  currency: string
  details: Record<string, string>
}

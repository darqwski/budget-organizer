export interface Reviewable {
  id: string
  date: Date | null
  money: number
  currency: string
  details: Record<string, string>
}

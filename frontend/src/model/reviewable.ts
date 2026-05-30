export interface Reviewable {
  id: string
  date: Date
  money: number
  currency: string
  name: string
  description: string
  details: Record<string, string>
}

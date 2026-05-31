//TODO Create backend for that

import type { Category } from "../model/categories.ts"
const tempCategories = [
  "Czynsz",
  "YemCookie",
  "Spożywcze",
  "Rata",
  "Transport",
  "Inne",
  "Podatek",
  "Media",
  "AGD",
  "Koncerty",
  "Prąd",
  "Ubrania",
  "Burek",
  "Usługi",
  "Leki",
  "Wyjazdy",
  "Drogeria",
  "Jedzenie zamawiane",
  "Samochód",
]

export const TEMP_CATEGORIES: Category[] = tempCategories.map((name) => ({
  name,
  id: name,
}))

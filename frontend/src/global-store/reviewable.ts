import { create } from "zustand"
import type { Reviewable } from "../model/reviewable.ts"

type UseReviewable = {
  reviewable: Reviewable[]
  setReviewable: (reviewable: Reviewable[]) => void
}

export const useCategories = create<UseReviewable>((set) => ({
  reviewable: [],
  setReviewable: (reviewable: Reviewable[]) => set({ reviewable }),
}))

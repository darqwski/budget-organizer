import { create } from "zustand"
import type { Reviewable } from "../model/reviewable.ts"

type UseReviewable = {
  reviewable: Reviewable[]
  setReviewable: (reviewable: Reviewable[]) => void
  removeReviewable: (reviewable: Reviewable) => void
  moveFirstToEnd: () => void
}

export const useReviewable = create<UseReviewable>((set) => ({
  reviewable: [],
  setReviewable: (reviewable: Reviewable[]) => set({ reviewable }),
  removeReviewable: (reviewable: Reviewable) => {
    set((current) => ({
      reviewable: current.reviewable.filter(
        (currentReviewable) => currentReviewable.id !== reviewable.id
      ),
    }))
  },
  moveFirstToEnd: () =>
    set((current) => {
      const [first, ...rest] = current.reviewable
      return { reviewable: [...rest, first] }
    }),
}))

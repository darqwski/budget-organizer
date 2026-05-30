import { create } from "zustand"
import type { Reviewed } from "../model/reviewed.ts"

type UseReviewed = {
  reviewed: Reviewed[]
  addReviewed: (reviewable: Reviewed) => void
  clearReviewed: () => void
}

export const useReviewed = create<UseReviewed>((set) => ({
  reviewed: [],
  addReviewed: (reviewed) =>
    set((current) => ({ reviewed: [...current.reviewed, reviewed] })),
  clearReviewed: () => set({ reviewed: [] }),
}))

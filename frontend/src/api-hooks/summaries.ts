import { create } from "zustand"
import { useEffect } from "react"
import type { Summary } from "../model/summaries.ts"
import { fetchSummaries } from "../api/summaries.ts"

type UseSummaries = {
  summaries: Summary[] | null
  loading: boolean
  setSummaries: (summaries: Summary[]) => void
  setLoading: (loading: boolean) => void
  refreshSummaries: () => void
}

const useSummaries = create<UseSummaries>((set) => ({
  summaries: null,
  setLoading: (loading) => set({ loading }),
  loading: false,
  setSummaries: (summaries: Summary[]) => set({ summaries }),
  refreshSummaries: () => set({ summaries: null }),
}))

export const useSummariesFromServer = () => {
  const { setLoading, loading, summaries, refreshSummaries, setSummaries } =
    useSummaries()

  useEffect(() => {
    if (summaries) {
      return
    }
    setLoading(true)
    fetchSummaries()
      .then((summaries) => {
        setSummaries(summaries)
      })
      .finally(() => setLoading(false))
  }, [summaries, setSummaries, setLoading])

  return {
    summaries,
    loading,
    refreshSummaries,
  }
}

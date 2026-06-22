import { create } from "zustand"
import { useEffect } from "react"
import { fetchSuggestAssignmentsConfig } from "../api/suggest-assignments-config.ts"
import type { SuggestAssignmentsConfig } from "../model/suggest-assignments-config.ts"

type UseConfigs = {
  suggestAssignmentsConfig?: SuggestAssignmentsConfig | null
  loading: boolean
  setSuggestAssignmentsConfig: (
    suggestAssignmentsConfig: SuggestAssignmentsConfig | null
  ) => void
  setLoading: (loading: boolean) => void
  refreshSuggestAssignmentsConfig: () => void
}

const useConfigs = create<UseConfigs>((set) => ({
  suggestAssignmentsConfig: undefined,
  setLoading: (loading) => set({ loading }),
  loading: false,
  setSuggestAssignmentsConfig: (
    suggestAssignmentsConfig: SuggestAssignmentsConfig | null
  ) => set({ suggestAssignmentsConfig }),
  refreshSuggestAssignmentsConfig: () =>
    set({ suggestAssignmentsConfig: null }),
}))

export const useConfigsFromServer = () => {
  const {
    suggestAssignmentsConfig,
    setSuggestAssignmentsConfig,
    setLoading,
    loading,
    refreshSuggestAssignmentsConfig,
  } = useConfigs()

  useEffect(() => {
    if (suggestAssignmentsConfig !== undefined) {
      return
    }
    setLoading(true)

    fetchSuggestAssignmentsConfig()
      .then((suggestAssignmentConfig) =>
        setSuggestAssignmentsConfig(suggestAssignmentConfig)
      )
      .finally(() => setLoading(false))
  }, [setLoading, setSuggestAssignmentsConfig, suggestAssignmentsConfig])

  return {
    suggestAssignmentsConfig,
    loading,
    refreshSuggestAssignmentsConfig,
  }
}

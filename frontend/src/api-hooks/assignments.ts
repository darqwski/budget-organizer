import { create } from "zustand"
import { useEffect } from "react"
import type { Assignment } from "../model/assignment.ts"
import { fetchAssignments } from "../api/assignments.ts"
import {
  clearAssignmentScoreTable,
  fillScoreTableWithAssignments,
} from "../utils/finding-assignment-rules/suggest-new-assignment-rule.ts"

type UseAssignments = {
  assignments: Assignment[] | null
  loading: boolean
  setAssignments: (assignments: Assignment[]) => void
  setLoading: (loading: boolean) => void
  refreshAssignments: () => void
}

const useAssignments = create<UseAssignments>((set) => ({
  assignments: null,
  setLoading: (loading) => set({ loading }),
  loading: false,
  setAssignments: (assignments: Assignment[]) => set({ assignments }),
  refreshAssignments: () => set({ assignments: null }),
}))

export const useAssignmentsFromServer = () => {
  const {
    assignments,
    setAssignments,
    setLoading,
    loading,
    refreshAssignments,
  } = useAssignments()

  useEffect(() => {
    if (assignments) {
      return
    }
    setLoading(true)
    fetchAssignments()
      .then((assignments) => {
        clearAssignmentScoreTable()
        console.time("Filling table with")
        fillScoreTableWithAssignments(assignments)
        console.timeEnd("Filling table with")
      })
      .finally(() => setLoading(false))
  }, [assignments, setAssignments, setLoading])

  return {
    assignments,
    loading,
    refreshAssignments,
  }
}

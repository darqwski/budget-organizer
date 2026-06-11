import type { PropsWithChildren } from "react"

// Implement some kind of showing when development but hiding on production
const DebugUtils = ({ children }: PropsWithChildren) => {
  return <>{children}</>
}

export default DebugUtils

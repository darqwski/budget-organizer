import type { PropsWithChildren } from "react"

const PageWrapper = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className="w-full flex items-center justify-center p-4 flex-col h-full overflow-auto">
      <div
        className={["w-full h-full lg:w-1/2 flex flex-col gap-4", className]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </div>
  )
}

export default PageWrapper

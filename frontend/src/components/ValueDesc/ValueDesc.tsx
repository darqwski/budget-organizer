const ValueDesc = ({
  desc,
  value,
  className,
  variant = "squashed",
}: {
  value: number | string | undefined | null
  desc: string | null
  className?: string
  variant?: "squashed" | "space-between"
}) => {
  if (variant === "space-between") {
    return (
      <dl
        className={[
          "flex items-center gap-4 font-semibold w-full",
          className,
        ].join(" ")}
      >
        <dd className="text-left overflow-hidden text-ellipsis whitespace-nowrap">
          {desc}
        </dd>
        <dt className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap text-right">
          {value}
        </dt>
      </dl>
    )
  }
  return (
    <dl className={["value-desc", className].filter(Boolean).join(" ")}>
      <dd className="flex-grow w-1/2 text-right">{desc}</dd>
      <dt className="flex-grow w-1/2 text-left">{value}</dt>
    </dl>
  )
}

export default ValueDesc

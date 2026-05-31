const ValueDesc = ({
  desc,
  value,
  className,
}: {
  value: number | string | undefined | null
  desc: string | null
  className?: string
}) => {
  return (
    <dl className={["value-desc", className].filter(Boolean).join(" ")}>
      <dd className="flex-grow w-1/2 text-right">{desc}</dd>
      <dt className="flex-grow w-1/2 text-left">{value}</dt>
    </dl>
  )
}

export default ValueDesc

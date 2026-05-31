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
      <dd>{desc}</dd>
      <dt>{value}</dt>
    </dl>
  )
}

export default ValueDesc

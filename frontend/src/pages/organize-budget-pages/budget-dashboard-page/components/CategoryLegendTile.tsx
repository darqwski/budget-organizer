import type { UICategory } from "../../../../model/categories.ts"

const CategoryLegendTile = ({
  category,
  className,
}: {
  category: UICategory
  className?: string
}) => {
  return (
    <div
      className={["flex flex-row gap-2", className].filter(Boolean).join(" ")}
    >
      <div
        className="w-4 h-4 border-2 border-black border-solid"
        style={{ background: category.color }}
      />
      <p>{category.name}</p>
    </div>
  )
}

export default CategoryLegendTile

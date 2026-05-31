import type { Reviewable } from "../../model/reviewable.ts"
import { Card, Divider } from "antd"
import { formatMoney } from "../../utils/format-money.ts"
import { useTranslation } from "react-i18next"
import { formatDate } from "../../utils/format-date.ts"
import ValueDesc from "../ValueDesc/ValueDesc.tsx"

type ReviewingProps = {
  reviewable: Reviewable
}
const Reviewing = ({ reviewable }: ReviewingProps) => {
  const { t } = useTranslation()
  return (
    <Card
      title={
        reviewable.date
          ? formatDate(reviewable.date)
          : t("Not processed yet (2-3 days ago)")
      }
    >
      <div className="flex flex-col gap-1">
        <div>
          {Object.entries(reviewable.details)
            .filter(([, value]) => value !== "")
            .map(([key, value]) => (
              <ValueDesc key={key} value={value} desc={key} />
            ))}
        </div>
        <Divider />
        <div>{formatMoney(reviewable.money, reviewable.currency)}</div>
      </div>
    </Card>
  )
}

export default Reviewing

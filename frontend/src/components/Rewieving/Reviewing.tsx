import type { Reviewable } from "../../model/reviewable.ts"
import { Card, Tooltip } from "antd"
import { formatMoney } from "../../utils/format-money.ts"
import { useTranslation } from "react-i18next"
import { formatDate } from "../../utils/format-date.ts"
import { colors } from "../../constants/colors.ts"

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
      actions={[
        <div>{formatMoney(reviewable.money, reviewable.currency)}</div>,
      ]}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <dl className="value-desc">
            <dd>{t("Name")}</dd>
            <dt>{reviewable.name}</dt>
          </dl>
          <dl className="value-desc">
            <dd>{t("Description")}</dd>
            <dt>{reviewable.description}</dt>
          </dl>
        </div>
        <div className="flex w-full items-end">
          <Tooltip
            styles={{
              container: { background: colors.white },
            }}
            title={
              <div>
                {Object.entries(reviewable.details).map(([key, value]) => (
                  <dl className="value-desc" key={key}>
                    <dd>{key}</dd>
                    <dt>{value}</dt>
                  </dl>
                ))}
              </div>
            }
          >
            <span>{t("More info")}</span>
          </Tooltip>
        </div>
      </div>
    </Card>
  )
}

export default Reviewing

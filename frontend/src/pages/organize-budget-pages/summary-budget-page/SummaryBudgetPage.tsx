import { Button, Card, Divider, Form, Input } from "antd"
import { useReviewed } from "../../../global-store/reviewed.ts"
import type { Category } from "../../../model/categories.ts"
import type { Reviewed } from "../../../model/reviewed.ts"
import { formatMoney } from "../../../utils/format-money.ts"
import { useTranslation } from "react-i18next"
import ValueDesc from "../../../components/ValueDesc/ValueDesc.tsx"
import PageWrapper from "../../../components/PageWrapper/PageWrapper.tsx"
import { useCategoriesFromServer } from "../../../api-hooks/categories.ts"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  summarySchema,
  type SummarySchema,
} from "../../../schemas/summary.schema.ts"
import ErrorMessage from "../../../components/Form/ErrorMessage/ErrorMessage.tsx"
import type { SummaryToAdd } from "../../../model/summaries.ts"
import { http } from "../../../api/http.ts"
import { useSummariesFromServer } from "../../../api-hooks/summaries.ts"
import { useNavigate } from "react-router"
import { addSummaries } from "../../../api/summaries.ts"
import type { AssignmentToAdd } from "../../../model/assignment.ts"

type CategorySummary = {
  category: Category
  items: Reviewed[]
  sum: number
  currency: string
}

const mapReviewedToAssignmentToAdd = (
  reviewedList: Reviewed[],
  summaryId: number
): AssignmentToAdd[] => {
  return reviewedList.map((reviewed) => {
    const { details, date, ...rest } = reviewed.reviewable
    return {
      summaryId,
      categoryId: reviewed.category.categoryId,
      payment: { ...rest, ...details, date: date?.getTime() ?? null },
    }
  })
}

const SummaryBudgetPage = () => {
  const { reviewed } = useReviewed()
  const { categories } = useCategoriesFromServer()
  const { refreshSummaries } = useSummariesFromServer()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const initialMap = (categories || []).reduce<Record<string, CategorySummary>>(
    (acc, category) => {
      acc[category.categoryId] = {
        category,
        items: [],
        sum: 0,
        currency: "",
      }

      return acc
    },
    {}
  )

  const { handleSubmit, control } = useForm<SummarySchema>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })
  const categorySummaryByCategoryId = reviewed.reduce<
    Record<string, CategorySummary>
  >((acc, reviewed) => {
    acc[reviewed.category.categoryId].items.push(reviewed)
    acc[reviewed.category.categoryId].sum += reviewed.reviewable.money
    if (reviewed.reviewable.currency) {
      acc[reviewed.category.categoryId].currency = reviewed.reviewable.currency
    }

    return acc
  }, initialMap)

  const summaries = Object.values(categorySummaryByCategoryId).sort((a, b) => {
    return a.sum - b.sum
  })

  const { income, costs, allItems } = summaries.reduce<{
    income: number
    costs: number
    allItems: number
  }>(
    (acc, summary) => {
      for (const item of summary.items) {
        if (item.reviewable.money > 0) {
          acc.income += item.reviewable.money
        } else {
          acc.costs += item.reviewable.money
        }
      }
      acc.allItems += summary.items.length

      return acc
    },
    {
      income: 0,
      costs: 0,
      allItems: 0,
    }
  )

  const saveSummary = async ({ title, description }: SummarySchema) => {
    const summaryToAdd: SummaryToAdd = {
      description,
      title,
      entries: summaries.map((summary) => ({
        category: summary.category,
        value: summary.sum,
      })),
    }
    const summaryId = await addSummaries(summaryToAdd)

    await http.post("/assignments/", {
      assignmentsToAdd: mapReviewedToAssignmentToAdd(reviewed, summaryId),
    })

    refreshSummaries()
    navigate("../")
  }

  const cancelSummary = () => {
    navigate("../")
  }

  return (
    <PageWrapper>
      <div className="w-full h-full flex flex-row gap-4">
        <Card className="flex w-1/2 flex-col items-center">
          {summaries.map((summary) => (
            <ValueDesc
              className="w-full"
              key={summary.category.name}
              value={`${formatMoney(summary.sum, summary.currency)} ${summary.items.length} ${t("items")}`}
              desc={summary.category.name}
              variant="space-between"
            />
          ))}
          <Divider />
          <ValueDesc className="w-full" value={income} desc={t("Income")} />
          <ValueDesc className="w-full" value={costs} desc={t("Costs")} />
          <ValueDesc
            className="w-full"
            value={income + costs}
            desc={t("Total")}
          />
          <ValueDesc
            className="w-full"
            value={allItems}
            desc={t("All items")}
          />
          <Divider />
          <form
            className="flex flex-col gap-1"
            onSubmit={handleSubmit(saveSummary)}
          >
            <Controller
              control={control}
              name="title"
              render={(controller) => {
                const error = controller.formState.errors[controller.field.name]

                return (
                  <Form.Item label={t("Summary title")}>
                    <Input {...controller.field} />
                    {error?.message && (
                      <ErrorMessage message={String(error.message)} />
                    )}
                  </Form.Item>
                )
              }}
            />
            <Controller
              control={control}
              name="description"
              render={(controller) => {
                const error = controller.formState.errors[controller.field.name]

                return (
                  <Form.Item label={t("Summary description")}>
                    <Input.TextArea {...controller.field} />
                    {error?.message && (
                      <ErrorMessage message={String(error.message)} />
                    )}
                  </Form.Item>
                )
              }}
            />
            <div className="flex gap-4">
              <Button variant="solid" htmlType="submit">
                {t("Save summary")}
              </Button>
              <Button onClick={cancelSummary}>{t("Cancel")}</Button>
            </div>
          </form>
        </Card>
        <Card className="flex w-1/2 flex-col items-center">
          <p>{t("Adjust summary")}</p>
          <p>
            TODO
            {t(
              "Select category that does not look right and review all items within"
            )}
          </p>
        </Card>
      </div>
    </PageWrapper>
  )
}

export default SummaryBudgetPage

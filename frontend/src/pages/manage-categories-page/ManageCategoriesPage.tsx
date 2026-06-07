import PageWrapper from "../../components/PageWrapper/PageWrapper.tsx"
import { useCallback, useMemo } from "react"
import {
  mutateAddCategory,
  mutateArchiveCategory,
} from "../../api/categories.ts"
import { Button, Card, Form, Input, Table } from "antd"
import { useTranslation } from "react-i18next"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  categorySchema,
  type CategorySchema,
} from "../../schemas/category.schema.ts"
import ErrorMessage from "../../components/Form/ErrorMessage/ErrorMessage.tsx"
import { DeleteFilled, PlusCircleFilled } from "@ant-design/icons"
import { useCategoriesFromServer } from "../../api-hooks/categories.ts"

const ManageCategoriesPage = () => {
  const { categories, refreshCategories } = useCategoriesFromServer()
  const { t } = useTranslation()
  const { handleSubmit, control, reset } = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema(categories ?? [])),
    defaultValues: {
      name: "",
    },
  })

  const addCategory = async (category: CategorySchema) => {
    await mutateAddCategory(category)
    refreshCategories()
    reset()
  }

  const archiveCategory = useCallback(
    async (categoryId: string) => {
      const categoryToArchive = categories?.find(
        (entry) => entry.categoryId === categoryId
      )
      console.log({ categoryToArchive })

      if (!categoryToArchive) {
        return
      }
      await mutateArchiveCategory(categoryToArchive)
      refreshCategories()
    },
    [categories, refreshCategories]
  )

  const categoryColumns = useMemo(
    () => [
      {
        title: t("Category ID"),
        dataIndex: "categoryId",
        key: "categoryId",
      },
      {
        title: t("Category"),
        dataIndex: "name",
        key: "name",
      },
      {
        title: t("Actions"),
        dataIndex: "categoryId",
        key: "actions",
        render: (categoryId: string) => (
          <Button
            size="small"
            type="primary"
            icon={<DeleteFilled />}
            onClick={() => archiveCategory(categoryId)}
          >
            {categoryId}
          </Button>
        ),
      },
    ],
    [archiveCategory, t]
  )
  return (
    <PageWrapper className="gap-8">
      <Table dataSource={categories ?? []} columns={categoryColumns} />
      <Card>
        <form className="flex gap-1" onSubmit={handleSubmit(addCategory)}>
          <Controller
            control={control}
            name="name"
            render={(controller) => {
              const error = controller.formState.errors[controller.field.name]

              return (
                <Form.Item label={t("Add new category")}>
                  <Input {...controller.field} />
                  {error?.message && (
                    <ErrorMessage message={String(error.message)} />
                  )}
                </Form.Item>
              )
            }}
          />
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusCircleFilled />}
          />
        </form>
      </Card>
    </PageWrapper>
  )
}

export default ManageCategoriesPage

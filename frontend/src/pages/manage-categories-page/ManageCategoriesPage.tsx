import PageWrapper from "../../components/PageWrapper/PageWrapper.tsx"
import { useCallback, useMemo, useState } from "react"
import {
  mutateAddCategory,
  mutateArchiveCategory,
} from "../../api/categories.ts"
import { Button, Card, Form, Input, Modal, Table } from "antd"
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
import type { Category } from "../../model/categories.ts"

const ManageCategoriesPage = () => {
  const { categories, refreshCategories } = useCategoriesFromServer()
  const { t } = useTranslation()
  const { handleSubmit, control, reset } = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema(categories ?? [])),
    defaultValues: {
      name: "",
    },
  })
  const [categoryToArchive, setCategoryToArchive] = useState<
    Category | undefined
  >()
  const addCategory = async (category: CategorySchema) => {
    await mutateAddCategory(category)
    refreshCategories()
    reset()
  }

  const archiveCategory = useCallback(async () => {
    if (!categoryToArchive) {
      return
    }
    await mutateArchiveCategory(categoryToArchive)
    setCategoryToArchive(undefined)
    refreshCategories()
  }, [categoryToArchive, refreshCategories])

  const onDeleteClick = useCallback(
    (categoryId: string) => {
      const categoryToArchive = categories?.find(
        (entry) => entry.categoryId === categoryId
      )
      if (!categoryToArchive) {
        return
      }

      setCategoryToArchive(categoryToArchive)
    },
    [categoryToArchive]
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
            onClick={() => onDeleteClick(categoryId)}
          >
            {categoryId}
          </Button>
        ),
      },
    ],
    [onDeleteClick, t]
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
      <Modal
        title={t("Archiving category")}
        open={!!categoryToArchive}
        onOk={() => archiveCategory()}
        onCancel={() => setCategoryToArchive(undefined)}
      >
        <p>{t("Do you want to remove category?", { categoryToArchive })}</p>
      </Modal>
    </PageWrapper>
  )
}

export default ManageCategoriesPage

import { Button, Card, Form, Input } from "antd"
import { useTranslation } from "react-i18next"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import ErrorMessage from "../../components/Form/ErrorMessage/ErrorMessage.tsx"
import { DeleteFilled, PlusCircleFilled } from "@ant-design/icons"
import { useConfigsFromServer } from "../../api-hooks/configs.ts"
import {
  suggestionAssignmentConfigSchema,
  type SuggestionAssignmentConfigSchema,
} from "../../schemas/suggestion-assignment-config.schema.ts"
import { mutateUpdateSuggestAssignmentsConfig } from "../../api/suggest-assignments-config.ts"
import type { SuggestAssignmentsConfig } from "../../model/suggest-assignments-config.ts"

const ManageConfigsPageForm = ({
  suggestAssignmentsConfig,
}: {
  suggestAssignmentsConfig: SuggestAssignmentsConfig | null
}) => {
  const { t } = useTranslation()
  const { refreshSuggestAssignmentsConfig } = useConfigsFromServer()
  console.log(
    "suggestAssignmentsConfig?.bannedKeys",
    suggestAssignmentsConfig?.bannedKeys
  )

  console.log("mapped", suggestAssignmentsConfig?.bannedKeys)

  const { handleSubmit, control, reset, formState } =
    useForm<SuggestionAssignmentConfigSchema>({
      resolver: zodResolver(suggestionAssignmentConfigSchema()),
      defaultValues: {
        bannedKeys: (suggestAssignmentsConfig?.bannedKeys ?? []).map(
          (name) => ({
            name,
          })
        ),
      },
    })

  console.log({ formState })

  const { fields, append, remove } = useFieldArray({
    keyName: "name",
    name: "bannedKeys",
    control,
  })

  const updateSuggestionAssignmentConfig = async (
    suggestAssignmentsConfig: Partial<SuggestionAssignmentConfigSchema>
  ) => {
    await mutateUpdateSuggestAssignmentsConfig({
      ...suggestAssignmentsConfig,
      bannedKeys: (suggestAssignmentsConfig.bannedKeys ?? []).map(
        ({ name }) => name
      ),
    })
    refreshSuggestAssignmentsConfig()
    reset()
  }

  console.log(fields)

  return (
    <Card>
      <form
        className="flex flex-col gap-1"
        onSubmit={handleSubmit(updateSuggestionAssignmentConfig)}
      >
        {fields.map((field, index) => (
          <Controller
            key={field.id}
            control={control}
            name={`bannedKeys.${index}.name`}
            render={(controller) => {
              const error = controller.formState.errors[controller.field.name]

              return (
                <div className="flex flex-row w-full">
                  <Form.Item label={t("Add new category")}>
                    <Input {...controller.field} />
                    {error?.message && (
                      <ErrorMessage message={String(error.message)} />
                    )}
                  </Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => remove(index)}
                    icon={<DeleteFilled />}
                  />
                </div>
              )
            }}
          />
        ))}
        <div>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => append({ key: "" })}
            icon={<PlusCircleFilled />}
          />
        </div>
        <Button type="primary" htmlType="submit">
          {t("Save configs")}
        </Button>
      </form>
    </Card>
  )
}

export default ManageConfigsPageForm

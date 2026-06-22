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
import { useAssignmentsFromServer } from "../../api-hooks/assignments.ts"
import ValueDesc from "../../components/ValueDesc/ValueDesc.tsx"

const ManageConfigsPageForm = ({
  suggestAssignmentsConfig,
}: {
  suggestAssignmentsConfig: SuggestAssignmentsConfig | null
}) => {
  const { t } = useTranslation()
  const { refreshSuggestAssignmentsConfig } = useConfigsFromServer()
  const { assignments } = useAssignmentsFromServer()

  const { handleSubmit, control, reset } =
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

  const assignmentKeyExamples = (() => {
    if (!assignments) return []
    const keyExamples: Record<string, (string | number)[]> = {}

    for (const assignment of assignments) {
      for (const [key, value] of Object.entries(assignment.payment)) {
        keyExamples[key] ??= []

        if (keyExamples[key].length > 3) {
          continue
        }

        if (value) {
          keyExamples[key].push(value)
        }
      }
    }

    return Object.entries(keyExamples).map(([key, values]) => ({ key, values }))
  })()

  return (
    <Card>
      <form
        className="flex flex-col gap-1"
        onSubmit={handleSubmit(updateSuggestionAssignmentConfig)}
      >
        <p className="font-semibold text-xl">{t("Banned keys")}</p>
        <p className="text-dark-grey xl">
          {t("These keys will not be use for suggesting rules")}
        </p>

        <Card>
          <p className="font-semibold">{t("Keys and their examples")}</p>
          <div>
            {assignmentKeyExamples.map((assignmentKeyExample) => (
              <ValueDesc
                className={[
                  "overflow-hidden text-ellipsis",
                  suggestAssignmentsConfig?.bannedKeys.includes(
                    assignmentKeyExample.key
                  ) && "opacity-50",
                ]
                  .filter(Boolean)
                  .join(" ")}
                value={assignmentKeyExample.values.join(",")}
                desc={assignmentKeyExample.key}
              />
            ))}
          </div>
        </Card>
        {fields.map((field, index) => (
          <Controller
            key={field.name}
            control={control}
            name={`bannedKeys.${index}.name`}
            render={(controller) => {
              const error = controller.formState.errors[controller.field.name]

              return (
                <div className="flex flex-row w-full">
                  <Form.Item label={t("Add new key")}>
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

import type { ReactNode } from "react"
import { Form } from "antd"
import {
  type Control,
  Controller,
  type ControllerRenderProps,
  type Path,
} from "react-hook-form"
import type { FieldValues } from "react-hook-form"

const FormField = <Schema extends FieldValues, Name extends Path<Schema>>({
  name,
  label,
  control,
  render,
}: {
  name: Name
  label: string
  control: Control<Schema>
  render: (props: ControllerRenderProps<Schema, Name>) => ReactNode
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={(controller) => {
        const error = controller.formState.errors[controller.field.name]

        return (
          <Form.Item label={label}>
            {render({ ...controller.field })}
            {error?.message && (
              <p className="font-xs text-error">{String(error.message)}</p>
            )}
          </Form.Item>
        )
      }}
    />
  )
}

export default FormField

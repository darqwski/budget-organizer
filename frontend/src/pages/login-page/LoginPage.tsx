import { useTranslation } from "react-i18next"
import { Button, Divider, Form, Input } from "antd"
import AppLogo from "../../components/AppLogo.tsx"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginSchema } from "../../schemas/login.schema.ts"
const LoginPage = () => {
  const { t } = useTranslation()

  const { handleSubmit, control } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  })

  const onSubmit = (values: LoginSchema) => {
    console.log({ values })
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <AppLogo />
        <p className="text-center text-xl">{t("Login")}</p>
        <form onSubmit={handleSubmit((values) => onSubmit(values))}>
          <Controller
            control={control}
            name="login"
            render={(controller) => {
              const error = controller.formState.errors[controller.field.name]

              return (
                <Form.Item label={t("Login")}>
                  <Input {...controller.field} />
                  {error?.message && (
                    <p className="font-xs text-error">
                      {String(error.message)}
                    </p>
                  )}
                </Form.Item>
              )
            }}
          />
          <Controller
            control={control}
            name="password"
            render={({ field, formState }) => {
              const error = formState.errors[field.name]

              return (
                <Form.Item label={t("Password")}>
                  <Input {...field} type="password" />
                  {error?.message && (
                    <p className="font-xs text-error">
                      {String(error.message)}
                    </p>
                  )}
                </Form.Item>
              )
            }}
          />
          <Button htmlType="submit">{t("Login")}</Button>
        </form>
        <Divider />
        <div></div>
      </div>
    </div>
  )
}

export default LoginPage

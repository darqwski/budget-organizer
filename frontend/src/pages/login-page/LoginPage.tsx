import { useTranslation } from "react-i18next"
import { Button, Divider, Form, Input } from "antd"
import AppLogo from "../../components/AppLogo.tsx"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginSchema } from "../../schemas/login.schema.ts"
import { http } from "../../api/http.ts"
import { sha256 } from "../../utils/sha256.ts"
import { loginUserEndpoint } from "../../api/auth.ts"
import { useNavigate } from "react-router"
import ErrorMessage from "../../components/Form/ErrorMessage/ErrorMessage.tsx"

const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { handleSubmit, control, setError, formState } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
      form: undefined,
    },
  })

  const onSubmit = async ({ login, password }: LoginSchema) => {
    const errorMessage = await loginUserEndpoint({ login, password })

    if (errorMessage) {
      setError("form", {
        message: t("Username or password is incorrect"),
      })
    } else {
      navigate("/budget")
    }
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
                    <ErrorMessage message={String(error.message)} />
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
                    <ErrorMessage message={String(error.message)} />
                  )}
                </Form.Item>
              )
            }}
          />
          <Button htmlType="submit">{t("Login")}</Button>
          {formState.errors.form && (
            <ErrorMessage message={String(formState.errors.form.message)} />
          )}
        </form>
        <Divider />
        <div></div>
      </div>
    </div>
  )
}

export default LoginPage

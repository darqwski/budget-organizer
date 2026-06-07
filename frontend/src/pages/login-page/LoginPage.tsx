import { useTranslation } from "react-i18next"
import { Button, Divider, Form, Input } from "antd"
import AppLogo from "../../components/AppLogo.tsx"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginSchema } from "../../schemas/login.schema.ts"
import { loginUserEndpoint } from "../../api/auth.ts"
import { useNavigate } from "react-router"
import ErrorMessage from "../../components/Form/ErrorMessage/ErrorMessage.tsx"
import PageWrapper from "../../components/PageWrapper/PageWrapper.tsx"
import { useState } from "react"

const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const { handleSubmit, control } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  })

  const onSubmit = async ({ login, password }: LoginSchema) => {
    const errorMessage = await loginUserEndpoint({ login, password })

    if (errorMessage) {
      setErrorMessage(t("Username or password is incorrect"))
    } else {
      navigate("/budget")
    }
  }

  return (
    <PageWrapper>
      <AppLogo />
      <p className="text-center text-xl">{t("Login")}</p>
      <form
        onBlur={() => setErrorMessage(undefined)}
        onSubmit={handleSubmit((values) => onSubmit(values))}
      >
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
        {errorMessage && <ErrorMessage message={errorMessage} />}
      </form>
      <Divider />
      <div></div>
    </PageWrapper>
  )
}

export default LoginPage

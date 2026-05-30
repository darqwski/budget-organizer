import { InfoCircleFilled, UploadOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"
import { SUPPORTED_BANKS } from "../../../constants/supported-banks.ts"
import { colors } from "../../../constants/colors.ts"

const ImportFilePage = () => {
  const { t } = useTranslation()

  const onFileUpload = (event: React.InputEvent) => {}

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-4 items-center justify-center">
        <UploadOutlined
          style={{ fontSize: "128px", color: colors.primary }}
          className="text-[128px]"
        />
        <div>
          <input type="file" onInput={(event) => onFileUpload(event)} />
        </div>
        <div>
          <p>{t("Provide a file with the transfer history")}</p>
          <p>
            {t("Currently supported:")} {SUPPORTED_BANKS.join(", ")}
          </p>
          <p>
            {t(
              "We are not sending this file anywhere - all data is processed locally"
            )}
            <InfoCircleFilled />
          </p>
        </div>
      </div>
    </div>
  )
}

export default ImportFilePage

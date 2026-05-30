import { InfoCircleFilled, UploadOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"
import { SUPPORTED_BANKS } from "../../../constants/supported-banks.ts"
import { colors } from "../../../constants/colors.ts"
import { mapPKOBPExcelToJson } from "../../../utils/file-parsers/map-pkobp-excel-to-json.ts"
import { useCategories } from "../../../global-store/reviewable.ts"
import { mapPKOBPCSVToJson } from "../../../utils/file-parsers/map-pkobp-csv-to-json.ts"

const ImportFilePage = () => {
  const { t } = useTranslation()
  const { setReviewable } = useCategories()
  const onFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async ({ target }) => {
      if (!target?.result) {
        return
      }
      console.log("file.type", file.type)

      if (file.type === "application/vnd.ms-excel") {
        setReviewable(await mapPKOBPExcelToJson(file))
      } else if (file.type === "text/csv") {
        setReviewable(await mapPKOBPCSVToJson(file))
      }
    }
    reader.onerror = function () {}
    reader.readAsText(file, "UTF-8")
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-4 items-center justify-center">
        <UploadOutlined
          style={{ fontSize: "128px", color: colors.primary }}
          className="text-[128px]"
        />
        <div>
          <input type="file" onChange={(event) => onFileUpload(event)} />
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

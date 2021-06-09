import React, {ChangeEvent, useState} from "react"
import {Box, Button, MenuItem, Select} from "@material-ui/core"
import {useMailTemplates} from "../../utils/mailTemplate"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../pages/RetrievalRequiredContent"
import {DisplaySaveStatus} from "../DisplaySaveStatus"

type Status = "initial" | "editing" | "saving" | "saved" | "saveFailed"

export const MailManagerDefaultMailTemplateSelector: React.FC<{
  defaultMailTemplate: MailTemplate | null,
  setDefaultMailTemplate: (mailTemplate: MailTemplate) => Promise<Success|Failure>,
}> = props => {
  const {mailTemplates, error} = useMailTemplates()
  const [selectedTemplate, setSelectedTemplate] = useState<MailTemplate|null>(props.defaultMailTemplate)
  const [status, setStatus] = useState<Status>("initial")
  if (error) return <ContentRetrievalFailedNotice description={"テンプレートデータの取得に失敗しました。"} />
  if (!mailTemplates) return <ContentRetrievingNotice />

  const onChange = (event: ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    setStatus("editing")
    const mailTemplateUUID = event.target.value as string
    const mailTemplate = mailTemplates.find(template => template.uuid === mailTemplateUUID)
    if (!mailTemplate) setSelectedTemplate(null)
    else setSelectedTemplate(mailTemplate)
  }

  const onClickSet = async () => {
    setStatus("saving")
    if (!selectedTemplate) {
      setStatus("saveFailed")
      return
    }
    const result = await props.setDefaultMailTemplate(selectedTemplate)
    if (result.ok) setStatus("saved")
    else setStatus("saveFailed")
  }

  return <Box m={2} p={2} style={{backgroundColor: "white"}}>
    <Box m={1}>
      メール本文生成の際に使用されるテンプレートのデフォルトを設定します。
    </Box>
    <Box m={1}>
      <Select fullWidth={true} onChange={onChange} value={props.defaultMailTemplate? props.defaultMailTemplate.uuid: ""}>
        {mailTemplates.map(mailTemplate => <MenuItem value={mailTemplate.uuid}>{mailTemplate.name}</MenuItem>)}
      </Select>
    </Box>
    <Box mt={1}>
      <DisplaySaveStatus status={status} />
    </Box>
    <Box mt={1}>
      <Button
        color={"primary"}
        disabled={status !== "editing"}
        fullWidth={true}
        onClick={onClickSet}
        variant={"contained"}
      >
        設定
      </Button>
    </Box>
  </Box>
}
import React, {ChangeEvent, useState} from "react"
import {Box, Button, MenuItem, Select} from "@material-ui/core"
import {useMailTemplates} from "../../utils/mailTemplate"
import {ContentRetrievalFailedNotice, ContentRetrievingNotice} from "../pages/RetrievalRequiredContent"

export const MailManagerDefaultMailTemplateSelector: React.FC<{
  defaultMailTemplate: MailTemplate | null,
  setDefaultMailTemplate: (mailTemplate: MailTemplate) => void,
}> = props => {
  const {mailTemplates, error} = useMailTemplates()
  const [selectedTemplate, setSelectedTemplate] = useState<MailTemplate|null>(props.defaultMailTemplate)
  if (error) return <ContentRetrievalFailedNotice description={"テンプレートデータの取得に失敗しました。"} />
  if (!mailTemplates) return <ContentRetrievingNotice />

  const onChange = (event: ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    const mailTemplateUUID = event.target.value as string
    const mailTemplate = mailTemplates.find(template => template.uuid === mailTemplateUUID)
    if (!mailTemplate) setSelectedTemplate(null)
    else setSelectedTemplate(mailTemplate)
  }

  const onClickSet = () => {
    if (!selectedTemplate) return
    props.setDefaultMailTemplate(selectedTemplate)
  }

  return <Box mt={2}>
    <Box display={"flex"}>
      <Box flexGrow={1} m={3}>
        <Select fullWidth={true} onChange={onChange}>
          {mailTemplates.map(mailTemplate => <MenuItem value={mailTemplate.uuid}>{mailTemplate.name}</MenuItem>)}
        </Select>
      </Box>
      <Box m={3}>
        <Button color={"primary"} onClick={onClickSet} variant={"outlined"}>設定</Button>
      </Box>
    </Box>
  </Box>
}
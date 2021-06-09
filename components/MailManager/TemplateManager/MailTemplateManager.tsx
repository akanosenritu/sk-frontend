import React, {ChangeEvent, useState} from "react"
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputBase,
  makeStyles,
  TextField,
  Typography
} from "@material-ui/core"
import SaveIcon from '@material-ui/icons/Save'
import RestoreIcon from '@material-ui/icons/Restore'
import CreateIcon from '@material-ui/icons/Create'
import {
  MailTemplateData,
  mailTemplateDataKeyDescriptions,
  mailTemplateDataKeys,
  TemplateDataKey
} from "../../../utils/mailTemplate"
import {createMailTemplate, updateMailTemplate} from "../../../utils/api/mailTemplate"

const useStyles = makeStyles({
  templateTextField: {
    fontSize: 16
  },
  templateEditorContainer: {
    border: "1px solid darkgray",
    borderRadius: 10,
  },
  templateEditorButtonsContainer: {
    backgroundColor: "#f2f2f2",
    borderBottomRightRadius: 10,
  },
  templateEditorStatusContainer: {
    backgroundColor: "#f2f2f2",
    paddingLeft: 50,
  },
  templateEditorTemplateNameContainer: {
    backgroundColor: "#f2f2f2",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  templateEditorTemplateNameInput: {
    backgroundColor: "inherit",
    flexGrow: 1,
  }
})

type Status = "initial" | "editing" | "saving" | "saved" | "error"

export const MailTemplateManager: React.FC<{
  onChangeTemplate: (newTemplate: MailTemplate) => void,
  setTemplateData: (newTemplateData: MailTemplateData) => void,
  template: MailTemplate,
  templateData: MailTemplateData,
}> = props => {
  const classes = useStyles()

  const [status, setStatus] = useState<Status>("initial")

  const [editingTemplateData, setEditingTemplateData] = useState(false)
  const handleTemplateDataChange = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const name = event.target.name as TemplateDataKey
    props.setTemplateData({
      ...props.templateData,
      [name]: event.target.value
    })
  }

  const [templateName, setTemplateName] = useState(props.template.name)
  const handleTemplateNameChange = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setStatus("editing")
    setTemplateName(event.target.value)
  }
  const [templateString, setTemplateString] = useState(props.template.template)
  const handleTemplateStringChange = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setStatus("editing")
    setTemplateString(event.target.value)
  }
  const onResetTemplate = () => {
    setStatus("initial")
    setTemplateString(props.template.template)
  }
  const onSaveTemplate = async () => {
    setStatus("saving")
    let result: SuccessWithData<MailTemplate>|Failure
    const newMailTemplate = {
      ...props.template,
      name: templateName,
      template: templateString
    }
    if (props.template.isSaved) {
      result = await updateMailTemplate(newMailTemplate)
    } else {
      result = await createMailTemplate(newMailTemplate)
    }
    if (result.ok) {
      setStatus("saved")
      props.onChangeTemplate(result.data)
    } else {
      setStatus("error")
    }
  }

  // const [associatedData, setAssociatedData] = useState()
  return <Box>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant={"h6"}>選択されているテンプレート</Typography>
        <Box mt={1}>
          生成されるメールの雛形となるテンプレートを編集できます。<b>{'{{}}'}</b>で囲まれた部分は、データ部分で定義された実際の値に置き換えられます。
        </Box>
        <Box mt={1} className={classes.templateEditorContainer}>
          <Box className={classes.templateEditorTemplateNameContainer} p={1} pl={5}>
            <InputBase
              className={classes.templateEditorTemplateNameInput}
              onChange={handleTemplateNameChange}
              value={templateName}
            />
          </Box>
          <Box pl={5} className={classes.templateEditorStatusContainer} >
            {status === "editing" && <span style={{color: "black"}}>保存されていない編集があります</span>}
            {status === "saving" && <span style={{color: "green"}}>保存中です</span>}
            {status === "saved" && <span style={{color: "green"}}>保存しました</span>}
            {status === "error" && <span style={{color: "red"}}>保存に失敗しました</span>}
          </Box>
          <Box display={"flex"}>
            <Box flexGrow={1}>
              <TextField
                fullWidth={true}
                InputProps={{
                  classes: {
                    input: classes.templateTextField
                  }
                }}
                multiline={true}
                onChange={handleTemplateStringChange}
                rows={25}
                value={templateString}
                variant={"outlined"}
              />
            </Box>
            <Box className={classes.templateEditorButtonsContainer}>
              <Box>
                <IconButton disabled={true}>
                  <CreateIcon />
                </IconButton>
              </Box>
              <Box>
                <IconButton onClick={onSaveTemplate} disabled={status !== "editing"}>
                  <SaveIcon />
                </IconButton>
              </Box>
              <Box>
                <IconButton onClick={onResetTemplate} disabled={status !== "editing"}>
                  <RestoreIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Typography variant={"h6"}>使用可能なデータ</Typography>
        <Box display={"flex"} justifyContent={"flex-end"}>
          <FormControlLabel
            control={
              <Checkbox
                checked={editingTemplateData}
                onChange={()=>setEditingTemplateData(!editingTemplateData)}
              />
            }
            label={"チェックするとデータを編集できます。書き換えたデータは永続しません。"}
          />
        </Box>
        <Box m={3}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <b>変数名</b>
            </Grid>
            <Grid item xs={3}>
              <b>説明</b>
            </Grid>
            <Grid item xs={7}>
              <b>値</b>
            </Grid>
            {mailTemplateDataKeys.map(key => (
              <>
                <Grid item xs={2} style={{wordBreak: "break-all"}}>
                  {key}
                </Grid>
                <Grid item xs={3}>
                  {mailTemplateDataKeyDescriptions[key]}
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    disabled={!editingTemplateData}
                    fullWidth={true}
                    multiline={true}
                    name={key}
                    onChange={handleTemplateDataChange}
                    value={props.templateData[key]}
                    variant={"outlined"}
                  />
                </Grid>
              </>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  </Box>
}
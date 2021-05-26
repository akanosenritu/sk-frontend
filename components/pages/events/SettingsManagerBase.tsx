import React, {useState} from "react"
import {useFormik} from "formik"
import {Box, Button, Card, CardContent, IconButton, InputBase, Typography} from "@material-ui/core"
import SaveIcon from "@material-ui/icons/Save"
import EditIcon from "@material-ui/icons/Edit"
import {cloneSetting, createBlankSetting, Setting} from "../../../utils/setting"

const SettingCard: React.FC<{
  setting: Setting,
  onSave: (setting: Setting) => void,
  onEdit: (setting: Setting) => void,
  editing: boolean
}> = (props) => {
  const formik = useFormik({
    initialValues: {
      title: props.setting.title,
      content: props.setting.content
    },
    onSubmit: (values) => props.onSave({
      uuid: props.setting.uuid,
      isSaved: false,
      title: values.title,
      content: values.content,
    })
  })

  const onClickSave = async () => {
    await formik.submitForm()
  }

  return <Card style={{margin: 10}}>
    <CardContent>
      <Box display={"flex"} alignItems={"center"}>
        {props.editing &&
          <Typography variant={"caption"} component={"span"} style={{verticalAlign: "middle", color: "red"}}>(編集中)</Typography>
        }
        <InputBase onChange={formik.handleChange} name={"title"} value={formik.values.title} style={{flexGrow: 1, marginLeft: 5, fontSize: "1.2em"}} disabled={!props.editing}/>
        {props.editing?
          <IconButton style={{margin: 0, padding: 0}} title={"保存する"} onClick={onClickSave}>
            <SaveIcon />
          </IconButton>:
          <IconButton onClick={()=>props.onEdit(props.setting)} style={{padding: 0}} title={"編集する"}>
            <EditIcon />
          </IconButton>
        }
      </Box>
      <Box ml={1}>
        <Box display={"flex"} alignItems={"center"}>
          <InputBase onChange={formik.handleChange} name={"content"} disabled={!props.editing} value={formik.values.content} style={{flexGrow: 1}} multiline={true}/>
        </Box>
      </Box>
    </CardContent>
  </Card>
}

const SettingsManagerBase: React.FC<{
  settings: Setting[],
  onSave: (newSettings: Setting[]) => void,
}> = props => {
  const [settings, setSettings] = useState<Setting[]>(props.settings)

  const onClickEditSetting = (setting: Setting) => {
    // it should ask the server if the setting can be modified or not.
    // if not, it should create a clone setting and edit it instead.
    // for the moment only the cloning option is implemented.
    const clonedSetting = cloneSetting(setting)
    setSettingsEditing(settings => [...settings, clonedSetting])
  }

  const [settingsEditing, setSettingsEditing] = useState<Setting[]>([])
  const onClickCreateNewSetting = () => {
    const setting = createBlankSetting()
    setSettingsEditing(settings => [...settings, setting])
  }
  const onSaveEditedSetting = (editedSetting: Setting) => {
    setSettingsEditing(settings => settings.filter(setting => setting.uuid !== editedSetting.uuid))
    props.onSave([...settings, editedSetting])
    setSettings([...settings, editedSetting])
  }

  return <Box mt={3} ml={3} display={"flex"} flexDirection={"column"}>
    {settings.map(setting => (
      <SettingCard setting={setting} onEdit={onClickEditSetting} onSave={onSaveEditedSetting} editing={false} key={setting.uuid}/>
    ))}
    {settingsEditing.map(setting => (
      <SettingCard setting={setting} onSave={onSaveEditedSetting} onEdit={onClickEditSetting} editing={true} key={setting.uuid}/>
    ))}
    <Button variant={"contained"} onClick={onClickCreateNewSetting}>新しい設定を作成</Button>
  </Box>
}

export default SettingsManagerBase
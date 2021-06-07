import React, {useEffect, useState} from "react"
import {Box, Button, Dialog, Grid, IconButton, makeStyles, TextField, Typography} from "@material-ui/core"
import {CollapsibleH5, H5} from "../../Header"
import {RegisteredStaff} from "../../../types/staffs"
import {AssignmentsByDay} from "../../../utils/event"
import CloseIcon from '@material-ui/icons/Close'
import {MailTemplateManager} from "../TemplateManager/MailTemplateManager"
import {createDefaultSubject, getTemplateData} from "../../../utils/mailTemplate"
import {Event} from "../../../types/positions"
import Mustache from "mustache"
import {checkIsMailSendable, sendMail} from "../../../utils/api/mail"
import {Alert} from "@material-ui/lab"

const useStyles = makeStyles({
  closeButton: {
    color: "white",
    fontSize: 30,
  },
  root: {
  },
  topBar: {
    backgroundColor: "darkgray",
    color: "white",
    verticalAlign: "middle",
  }
})

type MailSendStatus = "checking" | "sendable" | "notSendable" | "sending" | "sent" | "sendFailed"

export const MailSender: React.FC<{
  assignmentByDay: AssignmentsByDay,
  defaultMailTemplate: MailTemplate,
  event: Event,
  onClose: () => void,
  staff: RegisteredStaff,
}> = props => {
  const classes = useStyles()

  const [template, setTemplate] = useState<MailTemplate>(props.defaultMailTemplate)

  const templateData = getTemplateData(props.staff, props.assignmentByDay, props.event)
  const mailText = Mustache.render(template.template, templateData)

  const onClickCopyTextToClipboard = () => {
    navigator.clipboard.writeText(mailText)
  }

  const [mailSubject, setMailSubject] = useState(createDefaultSubject(props.event))
  const [mailSendStatus, setMailSendStatus] = useState<MailSendStatus>("checking")
  useEffect(() => {
    checkIsMailSendable(props.staff, props.event)
      .then(result => {
        if (result.data) setMailSendStatus("sendable")
        else setMailSendStatus("notSendable")
      })
  }, [])

  const onClickSendMail = async () => {
    setMailSendStatus("sending")
    const result = await sendMail(props.staff, mailSubject, mailText, props.event)
    if (result.ok) {
      setMailSendStatus("sent")
    } else {
      setMailSendStatus("sendFailed")
    }
  }

  return <Dialog
    fullScreen={true}
    open={true}
  >
    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} px={3} className={classes.topBar}>
      <Box ml={3} display={"flex"} alignItems={"center"}>
        <IconButton onClick={props.onClose} >
          <CloseIcon className={classes.closeButton} />
        </IconButton>
        <Box ml={3}>
          <Typography variant={"h5"}>テンプレートを設定してメールを送信する</Typography>
        </Box>
      </Box>

    </Box>
    <Box p={5} className={classes.root}>
      <Box mt={3}>
        <CollapsibleH5 title={"テンプレートの設定"} isOpen={false}>
          <Typography>使用するテンプレートを設定してください。テンプレートを編集した場合は、保存ボタンを押すと本文に反映されます。</Typography>
          <Box mt={3}>
            <MailTemplateManager
              template={template}
              onChangeTemplate={newTemplate => setTemplate(newTemplate)}
              templateData={templateData}
            />
          </Box>
        </CollapsibleH5>
      </Box>
      <Box mt={3}>
        <H5>生成されたメール本文</H5>
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid item xs={9}>
              <TextField
                disabled={true}
                fullWidth={true}
                multiline={true}
                value={mailText}
                variant={"outlined"}
              />
            </Grid>
            <Grid item xs={3}>
              <Box>
                <Typography variant={"h6"}>送信する</Typography>
                <Box mt={2} ml={2}>
                  {templateData.recipient}さん ({props.staff.emailAddress || "メールアドレスがありません"})に左の内容のメールを送信します。
                  送信済みのメールを取り消すことはできないので注意してください。
                  <Box mt={2}>
                    <TextField
                      disabled={true}
                      fullWidth={true}
                      label={"件名*"}
                      onChange={e => setMailSubject(e.target.value)}
                      value={mailSubject}
                      variant={"outlined"}
                    />
                  </Box>
                  <Box mt={2}>
                    {mailSendStatus === "notSendable" && <Alert severity={"error"}>
                      このスタッフにはすでにメールが送信されています。
                    </Alert>}
                    {mailSendStatus === "sending" && <Alert severity={"info"}>メールを送信中</Alert>}
                    {mailSendStatus === "sent" && <Alert severity={"success"}>メールを送信しました</Alert>}
                    {mailSendStatus === "sendFailed" && <Alert severity={"error"}>メールの送信に失敗しました</Alert>}
                  </Box>
                  <Box display={"flex"} justifyContent={"center"} mt={2}>
                    <Button
                      color={"primary"}
                      disabled={!props.staff.emailAddress || mailSendStatus !== "sendable"}
                      onClick={onClickSendMail}
                      variant={"outlined"}
                    >
                      送信する
                    </Button>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Typography variant={"h6"}>コピーする</Typography>
                <Box mt={2} ml={2}>
                  クリップボードに左のメール本文をコピーします。
                  <Box display={"flex"} justifyContent={"center"}>
                    <Button
                      color={"primary"}
                      disabled={!props.staff.emailAddress}
                      onClick={onClickCopyTextToClipboard}
                      variant={"outlined"}
                    >
                      コピーする
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  </Dialog>
}
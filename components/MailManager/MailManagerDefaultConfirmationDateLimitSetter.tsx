import React, {useState} from "react"
import {Box, Button} from "@material-ui/core"
import {DisplaySaveStatus} from "../DisplaySaveStatus"
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers"
import DateFnsUtils from "@date-io/date-fns"
import {ja} from "date-fns/locale"

type Status = "initial" | "editing" | "saving" | "saved" | "saveFailed"

export const MailManagerDefaultConfirmationDateLimitSetter: React.FC<{
  defaultConfirmationDateLimit: Date | null,
  setDefaultConfirmationDateLimit: (date: Date) => Promise<Success|Failure>,
}> = props => {
  const [status, setStatus] = useState<Status>("initial")
  const [date, setDate] = useState<Date|null>(props.defaultConfirmationDateLimit)

  const handleDateChange = (newDate: Date | null) => {
    setStatus("editing")
    setDate(newDate)
  }

  const onClickSet = async () => {
    setStatus("saving")
    if (!date) {
      setStatus("saveFailed")
      return
    }
    const result = await props.setDefaultConfirmationDateLimit(date)
    if (result.ok) setStatus("saved")
    else setStatus("saveFailed")
  }

  return <Box m={2} p={2} style={{backgroundColor: "white"}}>
    <Box m={1}>
      メール本文に埋め込まれる確認期限を設定します。
    </Box>
    <Box m={1}>
      <MuiPickersUtilsProvider locale={ja}　utils={DateFnsUtils}>
        <Box display={"flex"} justifyContent={"center"}>
          <DateTimePicker
            disablePast={true}
            emptyLabel={"確認日時を設定する"}
            onChange={handleDateChange}
            value={date}
          />
        </Box>
      </MuiPickersUtilsProvider>
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
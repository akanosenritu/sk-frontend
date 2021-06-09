import React from "react"
import {Alert} from "@material-ui/lab"

export const DisplaySaveStatus: React.FC<{
  status: string
}> = props => {
  return <div>
    {props.status === "saving" && <Alert severity={"info"}>保存中です</Alert>}
    {props.status === "saved" && <Alert severity={"success"}>保存しました</Alert>}
    {props.status === "saveFailed" && <Alert severity={"error"}>保存に失敗しました</Alert>}
  </div>
}
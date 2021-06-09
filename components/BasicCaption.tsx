import React from "react"
import {Typography} from "@material-ui/core"

export const BasicCaption: React.FC<{}> = props => {
  return <Typography variant={"body2"}>
    {props.children}
  </Typography>
}
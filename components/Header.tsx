import {Typography} from "@material-ui/core"
import React from "react"

export const H5: React.FC = props => {
  return <Typography variant={"h5"} style={{borderBottom: "1px solid black", paddingBottom: 3, marginBottom: 20}}>
    {props.children}
  </Typography>
}
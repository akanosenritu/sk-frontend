import React from "react"
import {makeStyles} from "@material-ui/core"

const useStyles = makeStyles({
  root: {
    backgroundColor: "darkgray",
  }
})

export const UnassignedStaffCell: React.FC<{}> = () => {
  const classes = useStyles()
  return <td colSpan={3} className={classes.root}/>
}
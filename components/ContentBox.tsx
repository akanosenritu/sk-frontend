import React from "react"
import {Box, makeStyles} from "@material-ui/core"

const useStyles = makeStyles({
  contentBox: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
  },
})

export const ContentBox: React.FC<{}> = props => {
  const classes = useStyles()
  return <Box mt={2} className={classes.contentBox}>
    {props.children}
  </Box>
}
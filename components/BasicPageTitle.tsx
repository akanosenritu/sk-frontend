import React from "react"
import {Box, makeStyles, Typography} from "@material-ui/core"

const useStyles = makeStyles({
  titleBox: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
})

export const BasicPageTitle: React.FC<{
  descriptions: string,
  title: string,
}> = props => {
  const classes = useStyles()
  return <Box className={classes.titleBox} mt={2}>
    <Typography variant={"h4"}>{props.title}</Typography>
    <Box mt={2}>
      {props.descriptions}
    </Box>
  </Box>
}
import React from "react"
import {Box, Button, makeStyles, Typography} from "@material-ui/core"

const useStyles = makeStyles({
  root: {
    backgroundColor: "white",
    border: "1px solid darkgray",
    borderRadius: 5,
    width: 400
  },
})

export const ActionItem: React.FC<{
  buttonText: string,
  description: string,
  onClick: () => void,
  title: string,
}> = props => {
  const classes = useStyles()
  return <Box className={classes.root} m={3}>
    <Box m={2}><Typography variant={"h6"}>{props.title}</Typography></Box>
    <Box m={2}>{props.description}</Box>
    <Box style={{display: "flex", justifyContent: "center"}} my={2}>
      <div>
        <Button color={"primary"} variant={"contained"} onClick={props.onClick}>{props.buttonText}</Button>
      </div>
    </Box>
  </Box>
}
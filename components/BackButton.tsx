import React from "react"
import {Button, makeStyles} from "@material-ui/core"
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

const useStyles = makeStyles({
  icon: {
    marginRight: 10
  }
})

export const BackButton: React.FC<{
  onClick: () => void,
}> = props => {
  const classes = useStyles()
  return <Button variant={"contained"} onClick={props.onClick}>
    <ArrowBackIcon className={classes.icon}/> 戻る
  </Button>
}
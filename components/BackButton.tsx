import React from "react"
import {Box, Button, makeStyles} from "@material-ui/core"
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

const useStyles = makeStyles({
  bottomButtonsContainer: {
    display: "flex",
  },
  icon: {
    marginRight: 10
  },
  mainContainer: {
    marginLeft: 30,
    flexGrow: 1,
  },
})

export const BackButton: React.FC<{
  onClick: () => void,
}> = props => {
  const classes = useStyles()
  return <Button variant={"contained"} onClick={props.onClick}>
    <ArrowBackIcon className={classes.icon}/> 戻る
  </Button>
}

export const BottomNavigationWithBackButton: React.FC<{
  onClickBack: () => void,
}> = props => {
  const classes = useStyles()
  return <Box className={classes.bottomButtonsContainer}>
    <BackButton onClick={props.onClickBack} />
    <Box className={classes.mainContainer}>
      {props.children}
    </Box>
  </Box>
}
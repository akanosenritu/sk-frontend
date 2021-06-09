import React from "react"
import {Box, makeStyles} from "@material-ui/core"
import {BackButton} from "./BackButton"
import {BasicPageTitle} from "./BasicPageTitle"

const useStyles = makeStyles({
  contentBox: {
    backgroundColor: "inherit",
    borderRadius: 15,
    padding: 10,
  },
  titleBox: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
})

export const BasicPage: React.FC<{
  descriptions: string,
  onClickBack?: () => void,
  title: string,
}> = props => {
  const classes = useStyles()
  return <div>
    <BasicPageTitle descriptions={props.descriptions} title={props.title} />
    <Box className={classes.contentBox} mt={2}>
      {props.children}
    </Box>
    {props.onClickBack && <Box my={2}>
      <BackButton onClick={props.onClickBack} />
    </Box>}
  </div>
}
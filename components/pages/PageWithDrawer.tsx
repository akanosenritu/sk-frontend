import React from 'react';
import MyDrawer from "./MyDrawer"
import {Box} from "@material-ui/core"
import {makeStyles} from "@material-ui/core"

const useStyles = makeStyles({
  contentBox: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    width: "80%",
  },
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
})
const PageWithDrawer: React.FC = (props) => {
  const classes = useStyles()

  return <Box className={classes.root}>
    <MyDrawer />
    <Box className={classes.contentBox}>
      <Box style={{flexGrow: 1}} m={6}>
        {props.children}
      </Box>
    </Box>
  </Box>
}

export default PageWithDrawer
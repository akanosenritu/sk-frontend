import React from 'react';
import MyDrawer from "./MyDrawer"
import {Box, makeStyles} from "@material-ui/core"

const useStyles = makeStyles({
  contentBox: {
    backgroundColor: "#f2f2f2",
    display: "flex",
    flexGrow: 1,
    height: "100vh",
    justifyContent: "center",
    paddingLeft: 50,
    paddingRight: 50,
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
      <Box style={{flexGrow: 1}}>
        {props.children}
      </Box>
    </Box>
  </Box>
}

export default PageWithDrawer
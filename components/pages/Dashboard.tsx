import React from 'react';
import {Box} from "@material-ui/core"
import {makeStyles} from "@material-ui/core"
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import {useUser} from "../../utils/user"
import AuthenticationRequiredContent from "./AuthenticationRequiredContent"

const useStyles = makeStyles({
  topBar: {
    display: "flex",
    justifyContent: "flex-end",
  },
  topBarUserInfoBox: {
    backgroundColor: "lightgray",
    border: "1px solid lightgray",
    borderRadius: 3,
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 10,
    minWidth: 150,
  },
  topBarUserInfoBoxIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    verticalAlign: "middle",
  },
  topBarUserInfoBoxUsername: {
    fontWeight: "bold",
    verticalAlign: "middle",
  }
})

const Dashboard: React.FC = () => {
  const classes = useStyles()
  const {user} = useUser()

  return <AuthenticationRequiredContent>
    <Box className={classes.topBar} m={2}>
      <Box className={classes.topBarUserInfoBox}>
        <AccountBoxIcon className={classes.topBarUserInfoBoxIcon} />
        {user.status === "authenticated" && user.username}
      </Box>
    </Box>
  </AuthenticationRequiredContent>
}

export default Dashboard
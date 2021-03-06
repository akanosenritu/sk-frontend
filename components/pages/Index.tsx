import React, {useEffect} from 'react'
import {useUser} from "../../utils/user"
import {Box, Button, makeStyles, Typography} from "@material-ui/core"
import {useRouter} from "next/router"

const useStyles = makeStyles(theme => ({
  title: {

  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  root: {
    height: "100vh",
    maxWidth: 400
  },
}))

const Index: React.FC = () => {
  const {checkUserStatus, user} = useUser()
  useEffect(() => {
    checkUserStatus()
  }, [])
  const classes = useStyles()
  const router = useRouter()

  if (user.status === "authenticated") router.push("/dashboard/")

  return <Box　display={"flex"} justifyContent={"center"}>
    <div className={classes.paper}>
      <Box m={2}>
        <Typography component="h1" variant="h4">
          管理アプリ v.0
        </Typography>
      </Box>
      <Box m={2}>
        <Button
          color={"primary"}
          onClick={()=>router.push("/signIn/")}
          variant={"contained"}
        >サインイン</Button>
      </Box>
    </div>
  </Box>
}

export default Index
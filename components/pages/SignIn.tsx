import React, {ChangeEvent, useEffect, useState} from 'react';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  makeStyles,
  TextField,
  Typography
} from "@material-ui/core"
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import {useRouter} from "next/router"
import {useUser} from "../../utils/user"

const useStyles = makeStyles(theme => ({
  title: {

  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const SignIn: React.FC = () => {
  const {user, checkUserStatus, isSigningIn, signIn, updateUser} = useUser()
  const router = useRouter()
  useEffect(() => {
    checkUserStatus()
      .then(user => updateUser(user))
  }, [])

  if (user.status === "authenticated") router.push("/dashboard/")

  const [errorText, setErrorText] = useState("")

  const [username, setUsername] = useState("")
  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setUsername(event.target.value)
    setErrorText("")
  }
  const [password, setPassword] = useState("")
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setPassword(event.target.value)
    setErrorText("")
  }

  const classes = useStyles()
  const onSubmit = async () => {
    const result = await signIn(username, password)
    if (result.ok) {
      await router.push("/dashboard/")
    } else {
      setErrorText("ユーザ情報が間違っています。")
    }
  }

  return <Box　display={"flex"} justifyContent={"center"}>
    <div className={classes.paper}>
      <Box m={2}>
        <Typography component="h1" variant="h4">
          管理アプリ v.0
        </Typography>
      </Box>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        サインイン
      </Typography>
      <form className={classes.form} noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="ユーザ名"
          name="username"
          onChange={handleUsernameChange}
          value={username}
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="パスワード"
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          autoComplete="current-password"
        />
        <Box display={"flex"}>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="ユーザ情報を保存する"
          />
          <Box m={1} style={{color: "red"}}>
            {errorText}
          </Box>
        </Box>
        <Button
          className={classes.submit}
          color="primary"
          disabled={isSigningIn}
          fullWidth
          onClick={onSubmit}
          type="button"
          variant="contained"
        >
          サインイン
        </Button>
      </form>
    </div>
  </Box>
}

export default SignIn
import React, {useEffect} from 'react';
import {useUser} from "../../utils/user"
import {useRouter} from "next/router"
import {Backdrop, CircularProgress} from "@material-ui/core"

const SignOut: React.FC = () => {
  const {signOut} = useUser()
  const router = useRouter()

  useEffect(() => {
    signOut()
      .then(() => {
        router.push("/")
      })
  })
  return <Backdrop open={true}>
    <CircularProgress color="inherit" />
  </Backdrop>
}

export default SignOut
import type {AppProps} from "next/app"
import "modern-css-reset/dist/reset.min.css"
import {useEffect} from "react"
import {useUser} from "../utils/user"
import {useRouter} from "next/router"

const AppInit = () => {
  const {user} = useUser()
  const router = useRouter()
  useEffect(() => {
    if (router.pathname !== "/") {
      if (router.pathname !== "/signIn" && user.status !== "authenticated") {
        router.push("/")
      }
    }
  }, [router.pathname, user])
  return null
}

function MyApp({Component, pageProps}: AppProps) {
  return <>
    <Component {...pageProps} />
    <AppInit />
  </>
}

export default MyApp
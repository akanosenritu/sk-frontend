import type {AppProps} from "next/app"
import "modern-css-reset/dist/reset.min.css"
import {useEffect} from "react"

function MyApp({Component, pageProps}: AppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return <>
    <Component {...pageProps} />
  </>
}

export default MyApp
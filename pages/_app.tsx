import 'styles/globals.css'
// import 'styles/dracula.css'
import 'styles/nord.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp

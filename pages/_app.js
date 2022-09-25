import Head from 'next/head'
import Script from 'next/script'
import Trackers from '@lib/trackers'
import GMTEvents from '@components/GTMEvents'
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {

  return (
    <>
      <Head>
        <title>Ifood</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script src="https://kit.fontawesome.com/b73a956a41.js"/>
      <Component {...pageProps} />

      <Trackers/>
      <GMTEvents/>
    </>
  )

}
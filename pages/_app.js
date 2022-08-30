import Head from 'next/head'
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'

import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/FooterV2/Footer'

export default function MyApp({ Component, pageProps }) {

  return (
    <>
      <Head>
        <title>Solarium - A Jornada do Sucesso</title>
        <link rel="icon" href="https://branching-stories.s3.amazonaws.com/fav.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/all.css" integrity="sha384-vp86vTRFVJgpjF9jiIGPEEqYqlDwgyBgEF109VFjmqGmIY/Y4HV4d3Gp2irVfcrp" crossOrigin="anonymous" />
        <link href="//vjs.zencdn.net/7.10.2/video-js.min.css" rel="stylesheet" />
        <script src="//vjs.zencdn.net/7.10.2/video.min.js" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </>
  )

}
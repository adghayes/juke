import '../styles/globals.css'
import Head from 'next/head'
import Header from '../components/Header'
import GlobalPlayer from '../components/GlobalPlayer'
import API from '../lib/api'
import { useEffect, useState } from 'react'
import "tailwindcss/tailwind.css";

function App({ Component, pageProps }) {
  const [loggedIn, setLoggedIn] = useState(false)
  useEffect(() => {
    setLoggedIn(API.loggedIn())
  })

  return (
    <div id="app" className="bg-gray-200">
      <Head>
        <title>Noisepuff</title>
        <link rel="icon" href="/favicon.ico" /> 
      </Head>
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
      <div id="main" className="max-w-screen-lg mx-auto mt-11 min-h-full bg-white">
        <Component {...pageProps} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
      </div>
      <GlobalPlayer/>
    </div>
  )
}

export default App

import '../styles/globals.css'
import Head from 'next/head'
import Header from '../components/Header'
import AccountAlert from '../components/AccountAlert'
import Footer from '../components/Footer'
import "tailwindcss/tailwind.css";
import React, {useEffect, useState} from 'react';
import Jukebox from '../lib/jukebox'
import debounce from 'lodash.debounce'

export const JukeboxContext = React.createContext({})
export const SetAlertContext = React.createContext(null)

function App({ Component, pageProps }) {

  function mutateJukebox(newJukebox){
    setJukebox(newJukebox)
  }

  const [jukebox, setJukebox] = useState(new Jukebox({mutateJukebox}))
  const [innerWidth, setInnerWidth] = useState(720)
  const debouncedSetInnerWidth = debounce(setInnerWidth, 1024)

  useEffect(() => {
    setInnerWidth(window.innerWidth)
    window.onresize = () => {
      debouncedSetInnerWidth(window.innerWidth)
    }

    return () => {
      window.onresize = null
    }
  }, [])

  const [accountAlert, setAccountAlert] = useState(null)
  
  return (
    <JukeboxContext.Provider value={jukebox}>
        <SetAlertContext.Provider value={setAccountAlert}>
        <div id="app" className="bg-gray-200 min-h-screen w-full relative">
          <Head>
            <title>Juke</title>
            <link rel="icon" href="/favicon.ico" /> 
          </Head>
          
          <Header />
          <AccountAlert message={accountAlert} close={() => setAccountAlert(null)}/>
          <Component {...pageProps} width={innerWidth}/>
          <Footer/>
        </div>
        </SetAlertContext.Provider>
    </JukeboxContext.Provider>
  )
}

export default App

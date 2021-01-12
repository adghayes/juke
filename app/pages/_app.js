import '../styles/globals.css'
import Head from 'next/head'
import Header from '../components/Header'
import AccountAlert from '../components/AccountAlert'
import Footer from '../components/Footer'
import "tailwindcss/tailwind.css";
import React, { useCallback, useEffect, useRef, useState} from 'react';
import Jukebox from '../lib/jukebox'
import { listen } from '../lib/api-track'

export const JukeboxContext = React.createContext({})
export const SetAlertContext = React.createContext(null)

function App({ Component, pageProps }) {

  const jukebox = useRef(new Jukebox({}))
  const [juke, setJuke] = useState({ jukebox: jukebox.current, id: 0 })
  

  useEffect(() => {
    jukebox.current.setJuke = setJuke
    window.jukebox = jukebox.current
    window.listen = listen
  }, [])

  const [accountAlert, setAccountAlert] = useState(null)
  
  return (
    <JukeboxContext.Provider value={juke}>
        <SetAlertContext.Provider value={setAccountAlert}>
        <div id="app" className="bg-gray-200 min-h-screen w-full relative">
          <Head>
            <title>Juke</title>
            <link rel="icon" href="/favicon.ico" /> 
          </Head>
          
          <Header />
          <AccountAlert message={accountAlert} close={() => setAccountAlert(null)}/>
          <div id="view" className={`fixed top-11 left-0 right-0 ${jukebox.track ? ' bottom-16 sm:bottom-12' : 'bottom-0' } overflow-y-scroll overflow-x-hidden`}>
            <Component {...pageProps}/>
          </div>
          <Footer/>
        </div>
        </SetAlertContext.Provider>
    </JukeboxContext.Provider>
  )
}

export default App

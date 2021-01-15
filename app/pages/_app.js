import '../styles/globals.css'
import Head from 'next/head'
import Header from '../components/Header'
import AccountAlert from '../components/AccountAlert'
import Footer from '../components/Footer'
import "tailwindcss/tailwind.css";
import React, { useCallback, useEffect, useRef, useState} from 'react';
import Jukebox from '../lib/jukebox'
import { listen } from '../lib/api-track'
import { mutate } from 'swr'

export const JukeContext = React.createContext({})

function App({ Component, pageProps }) {

  const jukebox = useRef(new Jukebox({}))
  const [myAlert, setAlert] = useState(null)

  const [juke, setJuke] = useState({ setAlert, jukebox: jukebox.current, id: 0 })
  

  useEffect(() => {
    jukebox.current.setJuke = setJuke
    window.jukebox = jukebox.current
    window.listen = listen
  }, [])
  
  return (
    <JukeContext.Provider value={juke}>
      <div id="app" className="bg-gray-200 min-h-screen w-full relative">
        <Head>
          <title>Juke</title>
          <link rel="icon" href="/favicon.ico" /> 
        </Head>
        
        <Header />
        <AccountAlert message={myAlert} close={() => setAlert(null)}/>
        <div id="view" className={`fixed top-11 left-0 right-0 ${jukebox.current.track ? ' bottom-16 sm:bottom-12' : 'bottom-0' } overflow-y-scroll overflow-x-hidden`}>
          <Component {...pageProps}/>
        </div>
        <Footer/>
      </div>
    </JukeContext.Provider>
  )
}

export default App

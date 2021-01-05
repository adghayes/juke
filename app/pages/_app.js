import '../styles/globals.css'
import Head from 'next/head'
import Header from '../components/Header'
import GlobalPlayer from '../components/GlobalPlayer'
import "tailwindcss/tailwind.css";
import React, {useEffect, useState} from 'react';
import Jukebox from '../lib/jukebox'
import debounce from 'lodash.debounce'

export const JukeboxContext = React.createContext({})
export const WindowContext = React.createContext(null)
function App({ Component, pageProps }) {

  const [jukebox, jukeboxSetter] = useState(new Jukebox({setJukebox}))
  const [innerWidth, setInnerWidth] = useState(0)
  const debouncedSetInnerWidth = debounce(setInnerWidth, 1024)

  useEffect(() => {
    setInnerWidth(window.innerWidth)
    window.onresize = (e) => {
      debouncedSetInnerWidth(window.innerWidth)
    }

    return () => {
      window.onresize = null
    }
  }, [])
  
  function setJukebox(newJukebox){
    jukeboxSetter(newJukebox)
  }

  return (
    <JukeboxContext.Provider value={jukebox}>
      <WindowContext.Provider value={innerWidth}>
        <div id="app" className="bg-gray-200 min-h-screen w-full relative">
          <Head>
            <title>Noisepuff</title>
            <link rel="icon" href="/favicon.ico" /> 
          </Head>
          <Header />
          <Component {...pageProps}/>
          <GlobalPlayer/>
        </div>
      </WindowContext.Provider>
    </JukeboxContext.Provider>
  )
}

export default App

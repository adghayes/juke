import '../styles/globals.css'
import Head from 'next/head'
import Header from '../components/Header'
import GlobalPlayer from '../components/GlobalPlayer'
import "tailwindcss/tailwind.css";

function App({ Component, pageProps }) {
  return (
    <div id="app" className="bg-gray-200">
      <Head>
        <title>Noisepuff</title>
        <link rel="icon" href="/favicon.ico" /> 
      </Head>
      <Header />
      <div id="main" className="max-w-screen-lg mx-auto mt-11 h-screen bg-white">
        <Component {...pageProps}/>
      </div>
      <GlobalPlayer/>
    </div>
  )
}

export default App

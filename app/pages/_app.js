import '../styles/globals.css'
import Head from 'next/head'
import Header from '../components/Header'
import GlobalPlayer from '../components/GlobalPlayer'
import "tailwindcss/tailwind.css";

function App({ Component, pageProps }) {
  return (
    <div id="app" className="bg-gray-200 min-h-screen w-full relative">
      <Head>
        <title>Noisepuff</title>
        <link rel="icon" href="/favicon.ico" /> 
      </Head>
      <Header />
      <Component {...pageProps}/>
      <GlobalPlayer/>
    </div>
  )
}

export default App

import "../styles/globals.css";
import Head from "next/head";
import Header from "../components/Header";
import AccountAlert from "../components/AccountAlert";
import Footer from "../components/Footer";
import "tailwindcss/tailwind.css";
import React, { useEffect, useRef, useState } from "react";
import Jukebox from "../lib/jukebox";

export const JukeContext = React.createContext({});

function App({ Component, pageProps }) {
  const jukebox = useRef(new Jukebox({}));
  const [myAlert, setAlert] = useState(null);
  const [footerVisible, setFooterVisible] = useState(false);

  const [juke, setJuke] = useState({
    setAlert,
    jukebox: jukebox.current,
    id: 0,
  });

  useEffect(() => {
    jukebox.current.setJuke = setJuke;
  }, []);

  useEffect(() => {
    if (jukebox.current.track) {
      setTimeout(() => setFooterVisible(true), 1000);
    }
  }, [!!jukebox.current.track]);

  return (
    <JukeContext.Provider value={juke}>
      <div id="app" className="bg-white min-h-screen w-screen relative">
        <Head>
          <title>Juke</title>
          <link rel="icon" href="/favicon.ico" />
          <script
            type="module"
            src="https://unpkg.com/ionicons@5.2.3/dist/ionicons/ionicons.esm.js"
          ></script>
          <script
            noModule=""
            src="https://unpkg.com/ionicons@5.2.3/dist/ionicons/ionicons.js"
          ></script>
        </Head>

        <Header />
        <AccountAlert alert={myAlert} close={() => setAlert(null)} />
        <div
          id="view"
          className={`fixed top-11 left-0 right-0 overflow-y-scroll overflow-x-hidden ${
            footerVisible ? " bottom-16 sm:bottom-12" : "bottom-0"
          } `}
        >
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </JukeContext.Provider>
  );
}

export default App;

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
  const [footerDisplace, setFooterDisplace] = useState(false);

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
      setTimeout(() => setFooterDisplace(true), 1500);
    }
  }, [!!jukebox.current.track]);

  return (
    <JukeContext.Provider value={juke}>
      <div id="app" className="bg-white min-h-screen w-screen relative">
        <Head>
          <title>Juke</title>
        </Head>

        <Header />
        <AccountAlert alert={myAlert} close={() => setAlert(null)} />
        <div
          id="view"
          className={`fixed top-11 left-0 right-0 overflow-y-auto overflow-x-hidden ${
            footerDisplace ? " bottom-16 sm:bottom-12" : "bottom-0"
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

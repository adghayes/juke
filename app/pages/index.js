import Player from "../components/Player";
import Spinner from "../components/Spinner";
import useRect from "../hooks/useRect";
import useQueue from "../hooks/useQueue";
import useUser from "../hooks/useUser";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import useJukebox from "../hooks/useJukebox";

export default function Home() {
  const [autoplay, setAutoplay] = useState(false);

  function ActionButton({ addClass }) {
    return (
      <Link href="/stream">
        <button
          onClick={() => setAutoplay(true)}
          className={
            "bg-white transform transition-transform duration-500  focus:outline-none hover:scale-110 hover:bg-gray-200 focus:scale-110 focus:bg-gray-200 text-black font-medium rounded " +
            addClass
          }
          disabled={autoplay}
        >
          Start Listening
        </button>
      </Link>
    );
  }

  return (
    <div className="bg-gradient-to-t from-pink-200 to-indigo-300 w-screen min-h-full flex flex-col">
      <main className="max-w-screen-lg xl:max-w-screen-xl mx-auto bg-white flex-grow flex flex-col justify-between">
        <section className="relative hidden sm:block">
          <Image
            src="/alexandre-st-louis-IlfpKwRMln0-unsplash.jpg"
            height={900}
            width={2480}
            alt="Man playing guitar over head, black and white"
          />
          <p className="absolute top-8 xl:top-16 left-16 text-white text-3xl lg:text-5xl leading-tight">
            Find and share music on <strong>Juke</strong>
          </p>
          <ActionButton addClass="text-lg xl:text-2xl absolute left-16 lg:left-24 top-3/4 px-2 py-0.5 lg:py-1" />
        </section>
        <section className="relative sm:hidden">
          <Image
            src="/konstantin-aal-Otx5FHbr3OE-unsplash-cropped.jpg"
            height={3173}
            width={3056}
            alt="Man playing saxophone, black and white"
          />
          <div className="absolute top-8 xs:top-24 left-1/4 right-2 flex flex-col justify-between items-center">
            <p className="text-center text-white text-3xl xs:text-4xl">
              Find and share music on <strong>Juke</strong>
            </p>
            <ActionButton addClass="text-xl self-center px-2 py-1 my-8" />
          </div>
        </section>
        <Spotlight autoplay={autoplay} />
        <p
          role="contentinfo"
          className="self-stretch text-xs text-center p-1 mt-4 border-t border-b"
        >
          Juke was seeded with tracks found on{" "}
          <a
            className="font-medium hover:underline"
            href="http://dig.ccmixter.org/"
            target="_blank"
          >
            Dig CC Mixter
          </a>
          . They are processed and redistributed under non-commercial Creative
          Commons licenses
        </p>
      </main>
    </div>
  );
}

function Spotlight({ autoplay }) {
  const jukebox = useJukebox();
  const queue = useQueue("feed");
  const { loggedOut } = useUser();
  const [rect, rectRef] = useRect(1000 / 12);
  const track = queue && queue.tracks[0];

  useEffect(() => {
    if (autoplay && !jukebox.playing && track) {
      jukebox.play(track, queue);
    }
  }, [autoplay]);

  return (
    <section
      ref={rectRef}
      className="flex-grow flex flex-col justify-center items-center"
    >
      {track && rect ? (
        <>
          <p className="p-4 md:text-xl">
            <Link href={`/${track.owner.slug}`}>
              <a className="hover:underline focus:underline font-semibold">
                {track.owner.display_name}
              </a>
            </Link>{" "}
            posted our most recent track...
          </p>
          <Player track={track} queue={queue} maxWidth={rect && rect.width} />
          <p className="px-4 md:text-xl py-4 text-center">
            and yours could be next!{" "}
            {loggedOut ? (
              <span className="px-2 font-normal whitespace-nowrap">
                <Link href="/register">
                  <a className="font-bold hover:underline">sign up</a>
                </Link>
                <span> or </span>
                <Link href="/login">
                  <a className="font-bold hover:underline">log in</a>
                </Link>
                <span> to upload...</span>
              </span>
            ) : null}
          </p>
        </>
      ) : (
        <Spinner />
      )}
    </section>
  );
}

import Player from "../components/Player.jsx";
import useRect from "../hooks/useRect.js";
import useQueue from "../hooks/useQueue.js";
import useUser from "../hooks/useUser.js";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gradient-to-t from-pink-200 to-indigo-300 w-screen min-h-screen">
      <main className="lg:min-w-min max-w-screen-lg xl:max-w-screen-xl mx-auto min-h-screen bg-white">
        <section className="relative">
          <Image
            src="/alexandre-st-louis-IlfpKwRMln0-unsplash.jpg"
            height={900}
            width={2480}
          />
          <p
            className={`absolute top-3 sm:top-8 xl:top-16 left-4 xs:left-12 sm:left-16 text-white 
             xs:text-xl sm:text-3xl lg:text-5xl leading-tight`}
          >
            Find and share music on <strong>Juke</strong>
          </p>
          <Link href="/stream">
            <button className="text-xs sm:text-base absolute left-8 xs:left-12 sm:left-24 top-3/4 bg-white hover:bg-gray-200 px-1 xs:px-2 xs:py-1 text-black font-bold xs:rounded">
              <span className="hidden xs:contents">Start Listening</span>
              <span className="contents xs:hidden">Listen</span>
            </button>
          </Link>
        </section>
        <Spotlight />
      </main>
    </div>
  );
}
useQueue;

function Spotlight() {
  const queue = useQueue("feed");
  const { loggedOut } = useUser();
  const [rect, rectRef] = useRect(500);
  const track = queue && queue.tracks[0];

  return (
    <section
      ref={rectRef}
      className="p-6 md:p-8 pb-12 flex flex-col justify-center items-center"
    >
      {queue ? (
        <>
          <p className="px-4 md:text-xl pb-6">
            <i>
              <strong>{track.owner.display_name}</strong>
            </i>{" "}
            posted our most recent track...
          </p>
          <Player track={track} maxWidth={rect && rect.width} />
          <p className="px-4 md:text-xl py-8 text-center">
            and yours could be next...{" "}
            {loggedOut ? (
              <span className="px-2 font-normal whitespace-nowrap">
                <Link href="/register">
                  <a className="font-bold hover:underline">sign up</a>
                </Link>
                <span> or </span>
                <Link href="/login">
                  <a className="font-bold hover:underline">log in</a>
                </Link>
                <span> to upload</span>
              </span>
            ) : null}
          </p>
        </>
      ) : null}
    </section>
  );
}

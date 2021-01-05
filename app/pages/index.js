import Player from "../components/Player.jsx";
import useSWR from "swr";
import API from "../lib/api";

export default function Home() {
  return (
    <div className="mt-11 bg-gradient-to-tr from-pink-300 to-blue-300">
      <main className="max-w-screen-lg mx-auto bg-white">
        <section className="relative">
          <img
            src="/guitar-man.jpg"
            alt="Man playing guitar above his head"
            width="1024"
            height="480"
          />
          <p
            className={`absolute top-8 sm:top-16 left-16 sm:right-1/2 text-white 
            sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-tight`}
          >
            Find and share music on <strong>Noisepuff</strong>
          </p>
        </section>
        <Spotlight />
      </main>
    </div>
  );
}

const spotlightTextClass = "p-6 text-2xl text-center";

function Spotlight() {
  const { data: track, error } = useSWR("spotlight", async (key) =>
    fetch(API.url(key)).then((res) => res.json())
  );
  const isLoading = !track && !error;
  if (isLoading) return null;

  return (
    <section className="border border-gray-500 p-6 mb-5 flex flex-col justify-center items-center">
      <p className={spotlightTextClass}>
        Today's Spotlight: <i>{track.title}</i> by{" "}
        <i>{track.owner.display_name}</i>{" "}
      </p>
      <Player track={track} />
      <p className={spotlightTextClass}>Tomorrow's Spotlight: your music?</p>
    </section>
  );
}

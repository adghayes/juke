import Player from "../components/Player.jsx";
import useSWR from "swr";
import API from "../lib/api";
import { getAvatar } from '../lib/thumbnails'
import TimeAgo from 'timeago-react'

export default function Home() {
  return (
    <div className="mt-11 bg-gradient-to-bl from-indigo-200 to-blue-300 min-h-screen">
      <main className="max-w-screen-lg mx-auto bg-white min-h-screen">
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
            Find and share music on <strong>Juke</strong>
          </p>
        </section>
        <Spotlight />
      </main>
    </div>
  );
}


function Spotlight() {
  const { data: track, error } = useSWR("spotlight", async (key) =>
    fetch(API.url(key)).then((res) => res.json()), {
      dedupingInterval: 1000 * 60 * 60
    }
  );
  const isLoading = !track && !error;
  if (isLoading || error) return null;

  return (
    <section className="p-6 flex flex-col justify-center items-center">
      <div className="flex flex-row items-center justify-center self-start pt-4 pb-8 px-4 md:px-16">
        <img src={getAvatar(track.owner.avatar)} alt="Your user avatar" width='36' height='36' className="rounded-full mx-2" />
        <p className="flex infline-flex md:text-xl">
          {track.owner.display_name} posted a track <TimeAgo datetime={track.created} className="pl-1"/>
        </p>
      </div>
      <Player track={track} />
      <p className='px-4 md:text-xl pt-8 font-bold'>the next track here could be yours...</p>
    </section>
  );
}

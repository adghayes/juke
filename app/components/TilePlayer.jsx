import { useState } from "react";
import useUser from "../hooks/useUser";
import { getThumbnail } from "../lib/thumbnails";
import Link from "next/link";
import useLiked from "../hooks/useLiked";
import useJukebox from "../hooks/useJukebox";

export default function TilePlayer({ track, queue }) {
  const jukebox = useJukebox();
  const { user } = useUser();
  const [liked, toggleLiked] = useLiked(user, track);
  const [hoverArt, setHoverArt] = useState(false);

  let active = jukebox.track && jukebox.track.id === track.id;
  let playing = active && jukebox.playing;

  return (
    <div className="bg-white rounded-xl flex-none flex flex-col w-48 border overflow-hidden">
      <div
        className="relative flex justify-center items-center w-48 h-48"
        onMouseEnter={() => setHoverArt(true)}
        onMouseLeave={() => setHoverArt(false)}
      >
        <img
          src={getThumbnail(track)}
          alt={`thumbnail for ${track.title} by ${track.owner.display_name}`}
          className="absolute inset-0"
        />
        <button
          aria-label={playing ? "Pause" : "Play"}
          className={
            "text-white bg-gradient-to-br from-gray-500 shadow-xl  to-gray-700 rounded-full w-16 h-16 flex items-center justify-center absolute top-16 right-16 " +
            (hoverArt || playing ? "opacity-100 focus:ring-2" : "opacity-0") +
            " focus:opacity-100 transition-opacity focus:outline-none transform "
          }
          onClick={() => jukebox.toggle(track, queue)}
        >
          {playing ? (
            <ion-icon name="pause" class="text-white text-4xl" />
          ) : (
            <ion-icon name="play" class="ml-1 text-white text-4xl" />
          )}
        </button>
      </div>
      <div className="flex flex-col self-start text-sm px-2 py-1.5 w-48">
        <span className="inline-flex items-center font-medium">
          <button
            aria-label={liked ? "Unlike" : "Like"}
            onClick={toggleLiked}
            className={
              "flex items-center text-lg " +
              (liked ? "text-pink-500" : "hover:text-gray-400 text-gray-300")
            }
          >
            <ion-icon name="heart" />
          </button>
          <Link href={`/${track.owner.slug}/${track.slug}`}>
            <a className="w-40 px-1 truncate text-gray-800 hover:text-black focus:text-black focus:underline outline-none">
              {track.title}
            </a>
          </Link>
        </span>
        <Link href={`/${track.owner.slug}`}>
          <a className="w-44 px-1 truncate text-gray-700 hover:text-black focus:text-black focus:underline outline-none">
            {track.owner.display_name}
          </a>
        </Link>
      </div>
    </div>
  );
}

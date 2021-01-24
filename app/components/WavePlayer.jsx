import { useMemo, useState } from "react";
import useUser from "../hooks/useUser";
import { getThumbnail } from "../lib/thumbnails";
import Link from "next/link";
import Waves from "./Waves";
import useLiked from "../hooks/useLiked";
import useJukebox from "../hooks/useJukebox";

const bottomButtonBase =
  "py-0.5 px-1.5 rounded inline-flex items-center justify-center divide-white m-1";

export default function WavePlayer({ track, queue, barCount, image }) {
  const jukebox = useJukebox();
  const { user } = useUser();
  const [liked, toggleLiked, numLikes] = useLiked(user, track);
  const textWidth = barCount * 3 - 64 + "px";

  let active = jukebox.track && jukebox.track.id === track.id;
  let playing = active && jukebox.playing;

  return (
    <div className="bg-white rounded-xl flex-none flex flex-row h-48 items-center border overflow-hidden relative">
      <img
        src={getThumbnail(track)}
        alt={`thumbnail for ${track.title} by ${track.owner.display_name}`}
        className="w-48 h-48 bg-gray-300"
      />
      <div className="flex flex-col justify-evenly items-start h-full py-0.5 px-4 min-w-max">
        <div className={`flex flex-row items-center divide-white my-1 `}>
          <button
            className="text-white bg-gray-700 rounded-full w-14 h-14 flex-none flex items-center justify-center hover:ring-2 focus:ring-2 ring-pink-500 focus:outline-none"
            onClick={() => jukebox.toggle(track, queue)}
          >
            {playing ? (
              <ion-icon name="pause" class="text-white text-4xl" />
            ) : (
              <ion-icon name="play" class="ml-1 text-white text-4xl" />
            )}
          </button>
          <div className="flex text-sm px-2 flex-col-reverse self-auto">
            <span className="inline-flex items-center font-medium">
              <Link href={`/${track.owner.slug}/${track.slug}`}>
                <a
                  className="px-0 truncate text-gray-800 hover:text-black focus:text-black focus:underline outline-none"
                  style={{ width: textWidth }}
                >
                  {track.title}
                </a>
              </Link>
            </span>
            <Link href={`/${track.owner.slug}`}>
              <a
                className="px-0 truncate text-gray-700 hover:text-black focus:text-black focus:underline outline-none"
                style={{ width: textWidth }}
              >
                {track.owner.display_name}
              </a>
            </Link>
          </div>
        </div>
        <Waves
          track={track}
          upperBarMinHeight={2}
          lowerBarMinHeight={1}
          upperBarMaxHeight={44}
          lowerBarMaxHeight={22}
          barWidth={2}
          barSpacing={1}
          barCount={barCount}
          lowerBarAlpha={0.4}
        />
        <div className="flex flex-row text-xs self-start">
          <LikeButton
            toggleLiked={toggleLiked}
            numLikes={numLikes}
            liked={liked}
          />
          <span className={bottomButtonBase + " divide-x-8"}>
            <ion-icon name="play" class="text-base text-gray-300" />
            <span>{track.num_plays}</span>
          </span>
          {track.download ? (
            <a
              href={track.download}
              className={
                bottomButtonBase +
                " divide-x-8 border border-gray-200 text-gray-300 hover:text-gray-400"
              }
              download
            >
              <ion-icon name="cloud-download" class="text-lg" />
              <span className="select-none text-black">Download</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function LikeButton({ toggleLiked, liked, numLikes }) {
  const [hover, setHover] = useState(false);

  return (
    <button
      type="button"
      onClick={toggleLiked}
      className={
        bottomButtonBase +
        " divide-x-8 border border-gray-200 " +
        (liked ? "text-pink-500" : "hover:text-gray-400 text-gray-300")
      }
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ion-icon name="heart" class="text-lg" />
      <span className="text-black">{numLikes}</span>
    </button>
  );
}

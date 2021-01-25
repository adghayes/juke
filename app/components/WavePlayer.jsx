import useUser from "../hooks/useUser";
import { getThumbnail } from "../lib/thumbnails";
import Link from "next/link";
import Waves from "./Waves";
import useLiked from "../hooks/useLiked";
import useJukebox from "../hooks/useJukebox";

const bottomButtonBase =
  "py-0.5 px-1.5 rounded inline-flex items-center justify-center divide-white divide-x-8 m-1";

export default function WavePlayer({ track, queue, barCount }) {
  const jukebox = useJukebox();
  const { user } = useUser();
  const textWidth = barCount * 3 - 64 + "px";

  let active = jukebox.track && jukebox.track.id === track.id;
  let playing = active && jukebox.playing;

  return (
    <div className="bg-white rounded-xl flex-none flex flex-row h-48 items-center border overflow-hidden">
      <img
        src={getThumbnail(track)}
        alt={`thumbnail for ${track.title} by ${track.owner.display_name}`}
        className="w-48 h-48 bg-gray-300"
      />
      <div className="flex flex-col justify-evenly items-start h-full py-0.5 px-4 min-w-max">
        <div className={`flex flex-row items-center divide-white my-1 `}>
          <button
            aria-label={playing ? "Pause" : "Play"}
            className="bg-gray-700 rounded-full w-14 h-14 flex-none flex items-center justify-center focus:ring-2 focus:outline-none"
            onClick={() => jukebox.toggle(track, queue)}
          >
            <div
              className={
                "flex items-center text-white text-4xl" +
                (playing ? "" : " ml-1")
              }
            >
              <ion-icon name={playing ? "pause" : "play"} />
            </div>
          </button>
          <div className="flex flex-col text-sm px-2 self-auto">
            <Link href={`/${track.owner.slug}`}>
              <a
                className="truncate text-gray-700 hover:text-black focus:text-black focus:underline outline-none"
                style={{ width: textWidth }}
              >
                {track.owner.display_name}
              </a>
            </Link>
            <Link href={`/${track.owner.slug}/${track.slug}`}>
              <a
                className="truncate text-gray-800 hover:text-black focus:text-black focus:underline outline-none"
                style={{ width: textWidth }}
              >
                {track.title}
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
          <LikeButton user={user} track={track} />
          <span className={bottomButtonBase}>
            <ion-icon name="play" class="text-base text-gray-300" />
            <span>{track.num_plays}</span>
          </span>
          {track.download ? (
            <a
              role="button"
              href={track.download}
              className={
                bottomButtonBase +
                "  border border-gray-200 text-gray-300 hover:text-gray-400"
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

function LikeButton({ user, track }) {
  const [liked, toggleLiked, numLikes] = useLiked(user, track);

  return (
    <button
      aria-label={liked ? "Unlike" : "Like"}
      onClick={toggleLiked}
      className={
        bottomButtonBase +
        "  border border-gray-200 " +
        (liked ? "text-pink-500" : "hover:text-gray-400 text-gray-300")
      }
    >
      <ion-icon name="heart" class="text-lg" />
      <span className="text-black">{numLikes}</span>
    </button>
  );
}

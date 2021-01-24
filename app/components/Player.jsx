import { useEffect, useMemo, useRef, useState } from "react";
import useUser from "../hooks/useUser";
import { getThumbnail } from "../lib/thumbnails";
import Link from "next/link";
import Waves from "./Waves";
import useLiked from "../hooks/useLiked";
import useJukebox from "../hooks/useJukebox";
import TilePlayer from "./TilePlayer";
import WavePlayer from "./WavePlayer";
import Spinner from "./Spinner";

const bottomButtonClasses =
  "py-0.5 px-1.5 rounded inline-flex items-center justify-center divide-white m-1";

function Player({ track, queue, maxWidth }) {
  const jukebox = useJukebox();
  const { user } = useUser();
  const [liked, toggleLiked, numLikes] = useLiked(user, track);
  const [hoverArt, setHoverArt] = useState(false);
  const image = useRef(null);

  const [horizontal, barCount, titleWidth] = useMemo(
    () => determineLayout(maxWidth),
    [maxWidth]
  );

  let active = jukebox.track && jukebox.track.id === track.id;
  let playing = active && jukebox.playing;

  function determineLayout(maxWidth) {
    if (maxWidth > 1240) {
      return [true, 288, "w-192"];
    } else if (maxWidth > 1080) {
      return [true, 240, "w-160"];
    } else if (maxWidth > 810) {
      return [true, 192, "w-128"];
    } else if (maxWidth > 650) {
      return [true, 144, "w-88"];
    } else if (maxWidth > 560) {
      return [true, 96, "w-56"];
    } else if (maxWidth > 430) {
      return [true, 72, "w-36"];
    } else {
      return [false, 0, "w-48"];
    }
  }

  if (!track) return <Spinner />;
  if (!horizontal) return <TilePlayer track={track} queue={queue} />;
  return <WavePlayer track={track} queue={queue} barCount={barCount} />;

  return (
    <div
      className={` bg-white rounded-xl flex-none flex ${
        horizontal ? "flex-row h-48" : "flex-col w-48"
      } items-center border overflow-hidden relative`}
    >
      <img
        onMouseEnter={() => setHoverArt(true)}
        onMouseLeave={() => setHoverArt(false)}
        src={getThumbnail(track)}
        alt={`thumbnail for ${track.title} by ${track.owner.display_name}`}
        className="w-48 h-48"
      />
      <div
        className={`flex flex-col justify-evenly items-start h-full py-0.5 ${
          horizontal ? "px-4 min-w-max" : ""
        }`}
      >
        <div className={`flex flex-row items-center divide-white my-1 `}>
          <button
            className={`text-white bg-gray-700 rounded-full w-14 h-14 flex-none flex items-center justify-center hover:ring-2 focus:ring-2 ring-pink-500 focus:outline-none ${
              horizontal ? "static" : "absolute top-16 right-16"
            }`}
            onClick={() => jukebox.toggle(track, queue)}
          >
            {playing ? (
              <ion-icon name="pause" class="text-white text-4xl" />
            ) : (
              <ion-icon name="play" class="ml-1 text-white text-4xl" />
            )}
          </button>
          <Labels
            track={track}
            titleWidth={titleWidth}
            liked={liked}
            toggleLiked={toggleLiked}
            horizontal={horizontal}
          />
        </div>
        {barCount ? (
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
        ) : null}
        <div
          className={` ${
            horizontal ? "" : "hidden"
          } flex flex-row text-xs self-start`}
        >
          <LikeButton
            toggleLiked={toggleLiked}
            numLikes={numLikes}
            liked={liked}
          />
          <span className={bottomButtonClasses + " divide-x-8"}>
            <ion-icon name="play" class="text-base text-gray-300" />
            <span className="">{track.num_plays}</span>
          </span>
          {track && track.download ? (
            <a
              href={track.download}
              className={
                bottomButtonClasses +
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

function Labels({ track, toggleLiked, liked, horizontal, titleWidth }) {
  return (
    <div
      className={`flex text-sm px-2 ${
        horizontal ? "flex-col-reverse self-auto" : "flex-col self-start w-48"
      }`}
    >
      <span className="inline-flex items-center font-medium">
        <button onClick={toggleLiked} className="contents">
          <i
            className={
              `icon ion-md-heart text-2xl leading-none ` +
              (liked ? "text-pink-500" : "hover:text-gray-400 text-gray-300") +
              (horizontal ? " hidden" : "")
            }
          />
        </button>
        <Link href={`/${track.owner.slug}/${track.slug}`}>
          <a
            className={`${titleWidth} ${
              horizontal ? "px-0" : "px-1"
            } truncate text-gray-800 hover:text-black focus:text-black focus:underline outline-none`}
          >
            {track.title}
          </a>
        </Link>
      </span>
      <Link href={`/${track.owner.slug}`}>
        <a
          className={`${titleWidth} ${
            horizontal ? "px-0" : "px-1"
          } truncate text-gray-700 hover:text-black focus:text-black focus:underline outline-none`}
        >
          {track.owner.display_name}
        </a>
      </Link>
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
        bottomButtonClasses +
        " divide-x-8 border border-gray-200 " +
        (liked ? "text-pink-500" : hover ? "text-gray-400" : "text-gray-300")
      }
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ion-icon name="heart" class="text-lg" />
      <span className="text-black">{numLikes}</span>
    </button>
  );
}

export default Player;

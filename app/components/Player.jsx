import { useContext, useEffect, useMemo, useState } from "react";

import { JukeboxContext } from "../pages/_app";
import useUser from "../hooks/useUser";
import { getThumbnail } from "../lib/thumbnails";

import Waves from "./Waves";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faHeart, faDownload } from "@fortawesome/free-solid-svg-icons";
import useLiked from "../hooks/useLiked";

const bottomButtonClasses = "py-0.5 px-1.5  rounded flex flex-row items-center justify-center divide-x-8 divide-white m-1"

function Player({ track, queue, maxWidth }) {
  const jukebox = useContext(JukeboxContext);
  const { user } = useUser();
  const [liked, toggleLiked, numLikes] = useLiked(user, track);

  const [horizontal, barCount, titleWidth] = useMemo(() => determineLayout(maxWidth), [maxWidth])

  let active = jukebox.track && jukebox.track.id === track.id;
  let playing = active && jukebox.playing;

  function determineLayout(maxWidth) {
    if (maxWidth > 1240) {
      return [true, 288, 'w-192']
    } else if (maxWidth > 1080) {
      return [true, 240, 'w-160'];
    } else if (maxWidth > 960) {
      return [true, 192, 'w-128'];
    } else if (maxWidth > 720) {
      return [true, 144, 'w-88'];
    } else if (maxWidth > 480) {
      return [true, 72, 'w-36'] ;
    } else {
      return [false, 0, 'w-48'];
    }
  }

  function togglePlay() {
    if (!active || !playing) {
      jukebox.play(track, queue);
    } else {
      jukebox.pause();
    }
  }

  return (
    <div className={`rounded-xl flex-none flex ${horizontal ? 'flex-row h-48 min-w-max' : 'flex-col w-48'} items-center border border-gray-300 overflow-hidden relative`}>
      <img
        src={getThumbnail(track.thumbnail)}
        alt={`thumbnail for ${track.title} by ${track.owner.display_name}`}
        className="w-48 h-48"
      />
      <div className={`flex-none flex flex-col justify-evenly items-start h-full py-2 ${horizontal ? 'px-4 min-w-max' : ''}`}>
        <div className={`flex flex-row items-center divide-white my-1 `}>
          <button
            className={`text-white bg-gray-700 rounded-full w-14 h-14 flex-none flex items-center justify-center ${horizontal ? 'static' : 'absolute top-16 right-16' }`}
            onClick={togglePlay}
          >
            {playing ? (
              <FontAwesomeIcon icon={faPause} className="w-6" />
            ) : (
              <FontAwesomeIcon icon={faPlay} className="w-7 pl-1" />
            )}
          </button>
          <div className={`flex text-sm px-2 ${ horizontal ? 'flex-col-reverse self-auto' : 'flex-col self-start w-48'}`}>
            <span className="inline-flex font-bold">
              <button onClick={toggleLiked}>
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`w-4 ${
                    liked ? "text-pink-500" : "text-gray-300"
                  } ${
                    horizontal ? 'hidden' : ''
                  }`}
                />
              </button>
              <span className={`${titleWidth} ${horizontal ? 'px-0' : 'px-2' } truncate`}>
                {track.title}
              </span>
            </span>
            <span className={`${titleWidth} ${horizontal ? 'px-0' : 'px-1' } truncate text-gray-700`}>
              {track.owner.display_name}
            </span>
          </div>
        </div>
        {barCount ? (
          <Waves
            track={track}
            scaleY={1}
            active={active}
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
        <div className={` ${ horizontal ? '' : 'hidden' } flex flex-row text-xs self-start`}>
          <button
            type="button"
            onClick={toggleLiked}
            className={bottomButtonClasses + " border border-gray-200"}
          >
            <FontAwesomeIcon
              icon={faHeart}
              className={`w-4 ${liked ? "text-pink-500" : "text-gray-300"}`}
            />
            <span className="">{numLikes}</span>
          </button>
          <span className={bottomButtonClasses}>
            <FontAwesomeIcon icon={faPlay} className={`w-3 text-gray-300`} />
            <span className="">{track.num_listens}</span>
          </span>
          {track && track.download ? (
            <a href={track.download} className={bottomButtonClasses + " border border-gray-200"}>
              <FontAwesomeIcon icon={faDownload} className={`w-3 text-gray-300`} />
              <span>Download</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Player;

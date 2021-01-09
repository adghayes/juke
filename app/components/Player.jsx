import { useContext, useEffect, useMemo, useState } from "react";

import { JukeboxContext } from "../pages/_app";
import useUser from "../hooks/useUser";
import { getThumbnail } from "../lib/thumbnails";

import Waves from "./Waves";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faHeart } from "@fortawesome/free-solid-svg-icons";
import useLiked from "../hooks/useLiked";

function Player({ track, queue, width }) {
  const jukebox = useContext(JukeboxContext);
  const { user } = useUser();
  const [liked, toggleLiked, numLikes] = useLiked(user, track);

  const barCount = useMemo(() => calculateBarCount(width || 900), [width]);

  let active = jukebox.track && jukebox.track.id === track.id;
  let playing = active && jukebox.playing;

  function calculateBarCount(innerWidth) {
    if (innerWidth > 1024) {
      return 288;
    } else if (innerWidth > 768) {
      return 198;
    } else if (innerWidth > 640) {
      return 144;
    } else if (innerWidth > 480) {
      return 96;
    } else {
      return 0;
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
    <div className="rounded-xl flex flex-col sm:flex-row items-center border border-gray-300 w-48 sm:w-full overflow-hidden relative">
      <img
        src={getThumbnail(track.thumbnail)}
        alt={`Thumbnail for ${track.title} by ${track.owner.display_name}`}
        className="w-48 h-48"
      />
      <div className="flex flex-col w-full items-center sm:items-start sm:px-4  my-1">
        <div className="flex items-center divide-white flex-col sm:flex-row my-1">
          <button
            className="text-white bg-gray-700 rounded-full w-14 h-14 flex items-center justify-center absolute top-16 sm:static"
            onClick={togglePlay}
          >
            {playing ? (
              <FontAwesomeIcon icon={faPause} className="w-6" />
            ) : (
              <FontAwesomeIcon icon={faPlay} className="w-7 pl-1" />
            )}
          </button>
          <div className="flex flex-col text-sm self-start w-48 px-2 sm:w-auto sm:text-base sm:flex-col-reverse sm:mx-2 sm:self-auto">
            <span className="inline-flex font-bold">
              <button onClick={toggleLiked}>
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`w-4 sm:hidden ${
                    liked ? "text-pink-500" : "text-gray-300"
                  }`}
                />
              </button>
              <span className="px-2 sm:px-0 truncate">{track.title}</span>
            </span>
            <span className="px-1 sm:px-0 text-gray-700">{track.owner.display_name}</span>
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
        <div className="hidden sm:flex flex-row text-xs self-start">
          <button
            type="button"
            onClick={toggleLiked}
            className="py-0.5 px-1.5 border border-gray-200 rounded flex flex-row items-center justify-center divide-x-8 divide-white m-1"
          >
            <FontAwesomeIcon
              icon={faHeart}
              className={`w-4 ${liked ? "text-pink-500" : "text-gray-300"}`}
            />
            <span className="">{numLikes}</span>
          </button>
          <span className="py-0.5 px-1.5  rounded flex flex-row items-center justify-center divide-x-8 divide-white m-1">
            <FontAwesomeIcon icon={faPlay} className={`w-3 text-gray-300`} />
            <span className="">{track.num_listens}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Player;

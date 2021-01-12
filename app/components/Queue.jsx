import useQueue from "../hooks/useQueue";
import Player from "../components/Player";
import useRect from "../hooks/useRect";
import useLoadingZone from "../hooks/useLoadingZone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faThLarge } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function Queue({ queueKey, emptyMessage, disableTileView, LabelComponent }) {
  const [rect, rectRef] = useRect(500);
  const queue = useQueue(queueKey);
  const LoadingZone = useLoadingZone(queue);
  const [tileView, setTileView] = useState(false);

  return (
    <div ref={rectRef} className="p-1 flex flex-col items-center w-full">
      {!disableTileView ? (
        <div className="flex flex-row justify-end self-stretch px-8 py-2 text-gray-800">
          <button
            className={`p-1 mx-1 ${tileView ? "" : "bg-gray-300"}`}
            onClick={() => setTileView(false)}
          >
            <FontAwesomeIcon icon={faList} className="w-6" />
          </button>
          <button
            className={`p-1 mx-1 ${tileView ? "bg-gray-300" : ""}`}
            onClick={() => setTileView(true)}
          >
            <FontAwesomeIcon icon={faThLarge} className="w-6" />
          </button>
        </div>
      ) : null}
      <ul
        className={`flex ${
          tileView ? "flex-row flex-wrap self-center" : "flex-col"
        }`}
      >
        {!!queue
          ? queue.tracks.map((track) => (
              <li
                key={track.id}
                className={`py-4 ${tileView ? "flex-grow px-4" : ""}`}
              >
                { LabelComponent ? <LabelComponent track={track}/> : null }
                <Player
                  track={track}
                  queue={queue}
                  maxWidth={tileView ? 0 : rect && rect.width}
                />
              </li>
            ))
          : null}
      </ul>
      {queue && queue.tracks.length === 0 ? (
        <p className="text-2xl text-gray-800">{emptyMessage}</p>
      ) : (
        LoadingZone
      )}
    </div>
  );
}

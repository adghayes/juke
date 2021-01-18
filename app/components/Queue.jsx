import useQueue from "../hooks/useQueue";
import Player from "../components/Player";
import useRect from "../hooks/useRect";
import useLoadingZone from "../hooks/useLoadingZone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faThLarge } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function Queue({
  queueKey,
  emptyMessage,
  disableTileView,
  LabelComponent,
}) {
  const [rect, rectRef] = useRect(200);
  const queue = useQueue(queueKey);
  const LoadingZone = useLoadingZone(queue);
  const [tileView, setTileView] = useState(false);

  return (
    <div
      role="feed"
      ref={rectRef}
      className="p-1 flex flex-col items-center w-full"
    >
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
          tileView ? "flex-row flex-wrap justify-center w-full" : "flex-col"
        }`}
      >
        {!!queue & !!rect
          ? queue.tracks.map((track) => (
              <li
                key={track.id}
                className={`py-4 flex flex-col items-center ${
                  tileView ? "px-4" : ""
                }`}
              >
                {LabelComponent ? <LabelComponent track={track} /> : null}
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
        <p className="text-center py-24 text-2xl font-bold text-gray-500">
          {emptyMessage}
        </p>
      ) : (
        LoadingZone
      )}
    </div>
  );
}

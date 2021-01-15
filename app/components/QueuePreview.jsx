import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import useQueue from "../hooks/useQueue";
import useUser from "../hooks/useUser";
import { getThumbnail } from "../lib/thumbnails";
import { JukeContext } from "../pages/_app";

export default function QueuePreview({
  title,
  queueKey,
  length,
  emptyMessage,
}) {
  const { loggedOut } = useUser();
  const jukebox = useContext(JukeContext).jukebox;
  const queue = useQueue(queueKey);
  const [overlay, setOverlay] = useState(false);

  useEffect(() => {
    setOverlay(loggedOut || (queue && queue.tracks.length === 0));
  }, [loggedOut, queue]);

  useEffect(() => {
    if (queue && queue.tracks.length <= length && queue.pushNext) {
      queue.pushNext();
    }
  }, [queue]);

  return (
    <section className="lg:w-64 xl:w-72 my-8 mx-4 border-gray-300 border rounded flex flex-col items-stretch overflow-hidden">
      <h2 className="text-lg font-bold px-4 py-2 bg-gradient-to-t from-gray-600 via-gray-700 to-gray-600 text-white border-b border-gray-300">
        {title}
      </h2>
      <div className="relative">
        <ul className="flex flex-col items-stretch border-gray-300 divide-y divide-gray-300">
          {[...Array(length).keys()].map((i) => {
            return (
              <li className="h-14" key={i}>
                {queue && queue.tracks[i] ? (
                  <PreviewItem
                    track={queue.tracks[i]}
                    queue={queue}
                    jukebox={jukebox}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
        <p
          className={`absolute inset-0 p-2 z-40 bg-gray-200 opacity-80 flex items-center justify-center text-center ${
            overlay ? "" : "hidden"
          }`}
        >
          {emptyMessage}
        </p>
      </div>
    </section>
  );
}

function PreviewItem({ track, queue, jukebox }) {
  const [hover, setHover] = useState(false);
  const current = jukebox.track && jukebox.track.id === track.id;
  const playing = current && jukebox.playing;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="h-full flex flex-row justify-start items-center px-1.5 py-1"
    >
      <div className="relative w-10 h-10 flex-none rounded overflow-hidden">
        <img src={getThumbnail(track.thumbnail)} alt="" />
        {hover || current ? (
          <button
            type="button"
            className="absolute top-1 left-1 rounded-full bg-gray-700 h-8 w-8 flex justify-center items-center p-2 text-white"
            onClick={() => jukebox.toggle(track, queue)}
          >
            <FontAwesomeIcon
              icon={playing ? faPause : faPlay}
              className={playing ? "w-4" : "w-4 pl-0.5"}
            />
          </button>
        ) : null}
      </div>
      <div className="flex flex-col justify-center items-start h-full p-2 text-xs">
        <p className="font-medium truncate w-48">{track.title}</p>
        <p className="font-light truncate w-48">{track.owner.display_name}</p>
      </div>
    </div>
  );
}

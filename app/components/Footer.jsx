import { useContext, useState, useRef, useEffect } from "react";
import { JukeContext } from "../pages/_app";
import { getThumbnail } from "../lib/thumbnails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStepForward,
  faStepBackward,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import useUser from "../hooks/useUser";
import useLiked from "../hooks/useLiked";

const buttonClass = "w-5 mx-2 sm:mx-3";
const frameInterval = 12;

function normalize(num) {
  return Math.max(Math.min(num, 1), 0);
}

function Footer() {
  const { jukebox } = useContext(JukeContext);
  const track = jukebox.track;
  const { user } = useUser();
  const [liked, toggleLiked] = useLiked(user, track);

  const [current, setCurrent] = useState(0);
  const [hover, setHover] = useState(false);
  const [drag, setDrag] = useState(false);
  const [nobPercent, setNobPercent] = useState(0);

  const animationId = useRef(null);
  const frameIndex = useRef(0);
  const nob = useRef(null);
  const bar = useRef(null);

  const barPercent = track && normalize(current / track.duration) * 100;
  const readableCurrent = jukebox.composeDuration(current);

  useEffect(() => {
    const animationStep = () => {
      if (frameIndex.current === 0) {
        setCurrent(jukebox.seek());
      }
      frameIndex.current = (frameIndex.current + 1) % frameInterval;
      animationId.current = requestAnimationFrame(animationStep);
    };

    if (jukebox.playing) {
      animationId.current = requestAnimationFrame(animationStep);
    } else {
      setCurrent(jukebox.seek());
    }

    return () => {
      cancelAnimationFrame(animationId.current);
    };
  }, [jukebox, jukebox.playing]);

  function togglePlay() {
    track && jukebox.playing ? jukebox.pause() : jukebox.play();
  }

  function getRatio(e) {
    const { left, right } = bar.current.getBoundingClientRect();
    const ratio = normalize((e.clientX - left) / (right - left));
    return ratio;
  }

  function seek(e) {
    const ratio = getRatio(e);
    setCurrent(ratio * track.duration);
    jukebox.seek(ratio);
  }

  function startDrag(e) {
    setNobPercent(barPercent);
    setDrag(true);

    document.body.onmousemove = (f) => {
      setNobPercent(getRatio(f) * 100);
    };

    document.body.onmouseup = (g) => {
      if (Math.abs(e.clientX - g.clientX) > 8) {
        seek(g);
      }
      setDrag(false);
      document.body.onmousemove = null;
      document.body.onmouseup = null;
    };
  }

  function skip(units) {
    jukebox.seek(normalize(current / track.duration + units / 32));
  }

  function handleKeyDown(e) {
    switch (e.key) {
      case "ArrowRight":
        skip(1);
        break;
      case "ArrowDown":
        skip(1);
        break;
      case "ArrowUp":
        skip(-1);
        break;
      case "ArrowLeft":
        skip(-1);
        break;
    }
  }

  return (
    <footer
      className={
        "z-30 fixed bottom-0 w-screen h-16 sm:h-12 bg-gray-700 flex justify-around items-center text-white py-2" +
        "transition transform-gpu duration-1000 " +
        (track ? "" : "translate-y-full")
      }
    >
      <div className="flex flex-row justify-center sm:w-48">
        <button
          type="button"
          className={buttonClass}
          onClick={() => jukebox.stepBack()}
        >
          <FontAwesomeIcon icon={faStepBackward} />
        </button>
        <button type="button" className={buttonClass} onClick={togglePlay}>
          {jukebox.playing ? (
            <FontAwesomeIcon icon={faPause} />
          ) : (
            <FontAwesomeIcon icon={faPlay} />
          )}
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => jukebox.stepForward()}
        >
          <FontAwesomeIcon icon={faStepForward} />
        </button>
      </div>
      <div className="flex-row items-center justify-center hidden sm:flex flex-grow">
        <span className="text-xs w-6 select-none">
          {track && readableCurrent}
        </span>
        <div
          className="flex flex-row px-2 py-4 flex-grow cursor-pointer"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => {
            if (e.target !== nob.current) seek(e);
          }}
        >
          <div
            className="relative rounded bg-gray-200 h-1 flex-grow"
            ref={bar}
            onKeyDown={handleKeyDown}
          >
            <div
              className="rounded bg-pink-500 absolute top-0 bottom-0 left-0"
              style={{ width: `${barPercent}%` }}
            />
            <div
              ref={nob}
              className={`absolute rounded-full w-4 h-4 left-1/2 top-1/2 bg-pink-500 transform -translate-x-1/2 -translate-y-1/2 ${
                hover || drag ? "" : "hidden"
              }`}
              style={{ left: `${drag ? nobPercent : barPercent}%` }}
              onMouseDown={startDrag}
            />
          </div>
        </div>
        <span className="w-6 text-xs select-none">
          {track && jukebox.readableDuration()}
        </span>
      </div>
      <div className="flex flex-row items-center sm:w-48 md:w-72 sm:px-4">
        <img
          src={getThumbnail(track)}
          alt=""
          className="w-12 h-12 mx-3 sm:w-8 sm:h-8 sm:mx-2 rounded"
        />
        <div className="flex flex-col w-24 text-sm sm:text-xs md:w-40">
          <span className="text-gray-200 truncate">
            {track && track.owner.display_name}
          </span>
          <span className="text-white truncate">{track && track.title}</span>
        </div>
        <button
          type="button"
          className={`${buttonClass} ${liked ? "text-pink-500" : "text-white"}`}
          onClick={toggleLiked}
        >
          <FontAwesomeIcon icon={faHeart} />
        </button>
      </div>
    </footer>
  );
}

export default Footer;

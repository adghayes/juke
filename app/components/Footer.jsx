import { useState, useRef, useEffect, useMemo } from "react";
import useUser from "../hooks/useUser";
import useLiked from "../hooks/useLiked";
import useJukebox from "../hooks/useJukebox";
import { getThumbnail } from "../lib/thumbnails";
import Link from "next/link";

const buttonClass = "flex items-center p-1.5";
const frameInterval = 6;
const rangeKeys = [
  "ArrowDown",
  "ArrowLeft",
  "ArrowUp",
  "ArrowRight",
  "PageUp",
  "PageDown",
];

function normalize(num) {
  return Math.max(Math.min(num, 1), 0);
}

export default function Footer() {
  const jukebox = useJukebox();
  const track = jukebox.track;
  const { user } = useUser();
  const [liked, toggleLiked] = useLiked(user, track);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (track) {
      const timeoutId = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timeoutId);
    }
  }, [!!track]);

  function togglePlay() {
    track && jukebox.playing ? jukebox.pause() : jukebox.play();
  }

  return (
    <footer
      className={
        "z-30 fixed bottom-0 w-screen h-16 sm:h-12 bg-gray-700 flex justify-around sm:justify-between items-center text-white p-2 md:px-8 " +
        "transition-opacity duration-1000 " +
        (!track ? "hidden" : visible ? "opacity-100" : "opacity-0")
      }
    >
      <div className="flex flex-row items-center justify-center">
        <button
          type="button"
          className={buttonClass + " hidden xs:flex"}
          onClick={() => jukebox.stepBack()}
          aria-label="Play Skip Back"
        >
          <ion-icon
            name="play-skip-back"
            class="text-2xl sm:text-xl"
          ></ion-icon>
        </button>
        <button
          type="button"
          aria-label={jukebox.playing ? "Pause" : "Play"}
          className={buttonClass}
          onClick={togglePlay}
        >
          <ion-icon
            name={jukebox.playing ? "pause" : "play"}
            class="text-4xl sm:text-2xl"
          ></ion-icon>
        </button>
        <button
          type="button"
          className={buttonClass + " hidden xs:flex"}
          onClick={() => jukebox.stepForward()}
          aria-label="Play Skip Forwrard"
        >
          <ion-icon
            name="play-skip-forward"
            class="text-2xl sm:text-xl"
          ></ion-icon>
        </button>
        <Repeat jukebox={jukebox} />
      </div>
      <Elapsed jukebox={jukebox} />
      <Volume jukebox={jukebox} />
      <div className="flex flex-row items-center">
        <img
          src={getThumbnail(track)}
          alt=""
          className="w-12 h-12 mx-3 sm:w-8 sm:h-8 sm:mx-2 rounded"
        />
        <div className="flex flex-col text-sm sm:text-xs w-32 xs:w-40">
          <span className="text-gray-200 truncate">
            {track ? (
              <Link href={`/${track.owner.slug}`}>
                <a className="hover:underline focus:underline outline-none">
                  {track.owner.display_name}
                </a>
              </Link>
            ) : null}
          </span>
          <span className="text-white truncate">{track && track.title}</span>
        </div>
        <button
          type="button"
          className={`${buttonClass} ${liked ? "text-pink-500" : "text-white"}`}
          onClick={toggleLiked}
        >
          <ion-icon name="heart" class="text-2xl sm:text-xl"></ion-icon>
        </button>
      </div>
    </footer>
  );
}

function Repeat({ jukebox }) {
  return (
    <button
      type="button"
      aria-label="Repeat"
      className={`${buttonClass} hidden md:flex relative ${
        jukebox.repeat === "none" ? "" : " text-pink-500"
      }`}
      onClick={() => jukebox.repeatMode()}
    >
      <ion-icon name="repeat" class="text-xl"></ion-icon>
      {jukebox.repeat === "track" ? (
        <i className="absolute rounded-full right-1 bottom-2 w-1.5 h-1.5 text-xs font-bold">
          1
        </i>
      ) : null}
    </button>
  );
}

function Elapsed({ jukebox }) {
  const track = jukebox.track;

  const [time, setTime] = useState(0);
  const [hover, setHover] = useState(false);
  const [drag, setDrag] = useState(false);
  const [focus, setFocus] = useState(false);
  const [nobPercent, setNobPercent] = useState(0);

  const animationId = useRef(null);
  const frameIndex = useRef(0);
  const nob = useRef(null);
  const bar = useRef(null);

  const barPercent = track && normalize(time / track.duration) * 100;
  const readableCurrent = jukebox.composeDuration(time);
  const readableDuration = track && jukebox.readableDuration();

  useEffect(() => {
    if (track) {
      console.log("attaching global keypress listener");
      document.body.onkeydown = (e) => {
        if (e.key === "ArrowRight") {
          skip(10);
        } else if (e.key === "ArrowLeft") {
          skip(-10);
        }
      };

      return () => (document.body.onkeydown = null);
    }
  }, [track]);

  useEffect(() => {
    const animationStep = () => {
      if (frameIndex.current === 0) {
        setTime(jukebox.seek());
      }
      frameIndex.current = (frameIndex.current + 1) % frameInterval;
      animationId.current = requestAnimationFrame(animationStep);
    };

    if (jukebox.playing) {
      animationId.current = requestAnimationFrame(animationStep);
    } else {
      setTime(jukebox.seek());
    }

    return () => {
      cancelAnimationFrame(animationId.current);
    };
  }, [jukebox.id]);

  function getRatio(e) {
    const { left, right } = bar.current.getBoundingClientRect();
    const ratio = normalize((e.clientX - left) / (right - left));
    return ratio;
  }

  function seek(e) {
    const newTime = getRatio(e) * track.duration;
    jukebox.seek(newTime);
    setTime(newTime);
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

  function skip(seconds) {
    const mark =
      jukebox.track.duration *
      normalize((jukebox.seek() + seconds) / jukebox.track.duration);
    jukebox.seek(mark);
  }

  function handleKeyDown(e) {
    if (rangeKeys.includes(e.key)) {
      e.stopPropagation();
      if (["ArrowDown", "ArrowLeft"].includes(e.key)) {
        skip(-10);
      } else if (["ArrowUp", "ArrowRight"].includes(e.key)) {
        skip(10);
      } else if (e.key === "PageUp") {
        skip(track.duration / 4);
      } else if (e.key === "PageDown") {
        skip(-track.duration / 4);
      }
    }
  }

  return (
    <div
      className="flex-row items-center justify-center hidden sm:flex flex-grow px-4"
      draggable="false"
    >
      <span className="text-xs w-8 select-none text-left">
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
        <div className="relative rounded bg-gray-200 h-1 flex-grow" ref={bar}>
          <div
            className="rounded bg-pink-500 absolute top-0 bottom-0 left-0"
            style={{ width: `${barPercent}%` }}
          />
          <div
            ref={nob}
            tabIndex={0}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onMouseDown={startDrag}
            onKeyDown={handleKeyDown}
            className={`absolute rounded-full w-3 h-3 left-1/2 top-1/2 bg-pink-500 transform -translate-x-1/2 -translate-y-1/2 outline-none ${
              hover || drag || focus ? "" : "opacity-0"
            }`}
            style={{ left: `${drag ? nobPercent : barPercent}%` }}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={track && track.duration}
            aria-valuenow={time}
            aria-valuetext={readableCurrent}
            aria-label="Track Time"
          />
        </div>
      </div>
      <span className="w-8 text-right text-xs select-none">
        {readableDuration}
      </span>
    </div>
  );
}

function Volume({ jukebox }) {
  const [volume, setVolume] = useState(1);
  const [unmuteVolume, setUnmuteVolume] = useState(1);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [sliderState, setSliderState] = useState("hidden");
  const track = useRef(null);

  function selectedVolume(e) {
    const { top, bottom } = track.current.getBoundingClientRect();
    const ratio = normalize((e.clientY - top) / (bottom - top));
    return 1 - ratio;
  }

  function toggleMute() {
    if (volume > 0) {
      setUnmuteVolume(volume);
      setVolume(0);
    } else {
      setVolume(unmuteVolume);
    }
  }

  function adjustVolume(amount) {
    setVolume(normalize(volume + amount));
  }

  function handleKeyDown(e) {
    if (rangeKeys.includes(e.key)) {
      e.preventDefault();
      if (["ArrowDown", "ArrowLeft"].includes(e.key)) {
        adjustVolume(-0.0625);
      } else if (["ArrowUp", "ArrowRight"].includes(e.key)) {
        adjustVolume(0.0625);
      } else if (e.key === "PageUp") {
        adjustVolume(0.25);
      } else if (e.key === "PageDown") {
        adjustVolume(-0.25);
      }
    }
  }

  useEffect(() => {
    jukebox.volume(volume);
  }, [volume]);

  useEffect(() => {
    setSliderState("opacity-0");
    let id;
    if (hover || focus) {
      id = setTimeout(() => setSliderState("opacity-100"), 100);
    } else {
      id = setTimeout(() => setSliderState("hidden"), 500);
    }
    return () => clearTimeout(id);
  }, [hover || focus]);

  return (
    <div
      className="relative py-2 mx-1 hidden md:block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className={buttonClass}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onClick={toggleMute}
        role="slider"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={volume * 100}
      >
        <ion-icon name={volumeIconName(volume)} class="text-xl"></ion-icon>
      </button>

      <div
        className={
          "border border-gray-400 rounded shadow-xl absolute bg-gray-700 z-40 h-32 w-8 bottom-11 left-0 flex justify-center items-center cursor-pointer transition-opacity duration-300 " +
          sliderState
        }
        onClick={(e) => {
          setVolume(selectedVolume(e));
        }}
      >
        <div className="bg-gray-300 h-24 w-1 rounded relative" ref={track}>
          <div
            className="bg-pink-500 absolute bottom-0 left-0 right-0 rounded"
            style={{ height: `${volume * 100}%` }}
          ></div>
          <div
            className="bg-pink-500 absolute h-3 w-3 rounded-full transform -translate-x-1/3 translate-y-1/2"
            style={{ bottom: `${volume * 100}%` }}
          >
            <div
              draggable="true"
              className="absolute inset-0 rounded-full bg-transparent z-50 select-none"
              onDrag={(e) =>
                e.clientY > 0 ? setVolume(selectedVolume(e)) : null
              }
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function volumeIconName(volume) {
  if (volume === 0) {
    return "volume-mute";
  } else if (volume < 1 / 3) {
    return "volume-low";
  } else if (volume < 2 / 3) {
    return "volume-medium";
  } else {
    return "volume-high";
  }
}

import { useContext, useEffect, useState, useRef, useMemo } from "react";
import { JukeContext } from "../pages/_app";

const base64 =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const frameInterval = 12;

const playedColor = [219, 39, 119, 1];
const selectedColor = [131, 24, 67, 1];
const unplayedColor = [107, 114, 128, 1];
const inactiveColor = [107, 114, 128, 0.8];

function normalize(num) {
  return Math.max(Math.min(num, 1), 0);
}

function rgba(color, alpha) {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${
    alpha ? alpha : color[3]
  })`;
}

function rgbaMidpoint(color1, color2, ratio) {
  const [r1, g1, b1, a1] = color1;
  const [r2, g2, b2, a2] = color2;
  const r = r1 * (1 - ratio) + r2 * ratio;
  const g = g1 * (1 - ratio) + g2 * ratio;
  const b = b1 * (1 - ratio) + b2 * ratio;
  const a = a1 * (1 - ratio) + a2 * ratio;
  return [r, g, b, a];
}

export default function Waves({
  track,
  active,
  barCount,
  upperBarMaxHeight,
  upperBarMinHeight,
  lowerBarMaxHeight,
  lowerBarMinHeight,
  barWidth,
  barSpacing,
  lowerBarAlpha,
}) {
  const jukebox = useContext(JukeContext).jukebox;

  const canvasElement = useRef(null);
  const [ctx, setCtx] = useState(null);
  const peaks = useMemo(
    () => track && track.peaks.split("").map((char) => base64.indexOf(char)),
    [track]
  );
  const bars = useMemo(calculateBars, [peaks, barCount]);

  const [hover, setHover] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const hoverPosition = useRef(null);
  const playPosition = useRef(0);
  const animationId = useRef(null);
  const frameIndex = useRef(0);

  const height = lowerBarMaxHeight + upperBarMaxHeight + 1;
  const barOffset = barWidth + barSpacing;
  const width = barCount * barOffset;
  const lowerBarScale = (lowerBarMaxHeight - lowerBarMinHeight) / 63;
  const upperBarScale = (upperBarMaxHeight - upperBarMinHeight) / 63;

  function calculateBars() {
    const step = peaks.length / barCount;
    let i = 0;
    const bars = [];
    while (i < barCount) {
      let slice = peaks.slice(Math.floor(step * i), Math.floor(step * (i + 1)));
      bars.push(slice.reduce((acc, el) => acc + el) / slice.length);
      i += 1;
    }
    return bars;
  }

  useEffect(() => {
    setCtx(canvasElement.current.getContext("2d"));
  }, []);

  useEffect(() => {
    if (ctx && bars) {
      if (active && (hover || jukebox.playing)) {
        animationId.current = window.requestAnimationFrame(animationStep);
      } else {
        refresh();
      }
    }

    return () => {
      window.cancelAnimationFrame(animationId.current);
    };
  }, [ctx, bars, hover, active, jukebox, jukebox.playing, active]);

  function refresh() {
    playPosition.current = jukebox.seek();
    setPlayTime(Math.floor(playPosition.current));
    draw();
  }

  function animationStep() {
    if (frameIndex.current === 0 || hover) {
      refresh();
    }
    animationId.current = window.requestAnimationFrame(animationStep);
    frameIndex.current = (frameIndex.current + 1) % frameInterval;
  }

  function drawBar(y, index, color) {
    ctx.fillStyle = rgba(color);
    ctx.fillRect(
      barOffset * index,
      upperBarMaxHeight,
      barWidth,
      -(upperBarMinHeight + upperBarScale * y)
    );
    ctx.fillStyle = rgba(color, lowerBarAlpha);
    ctx.fillRect(
      barOffset * index,
      upperBarMaxHeight + 1,
      barWidth,
      lowerBarMinHeight + lowerBarScale * y
    );
  }

  function drawBars(colors, breakpoints) {
    let barIndex = 0;
    let colorIndex = 0;

    while (barIndex < barCount) {
      if (barIndex >= breakpoints[colorIndex]) colorIndex += 1;
      drawBar(bars[barIndex], barIndex, colors[colorIndex]);
      barIndex += 1;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    if (!active) {
      drawBars([hover ? unplayedColor : inactiveColor], [barCount]);
    } else {
      const currentBar = Math.floor(
        (playPosition.current / track.duration) * barCount
      );
      const currentBarRatio =
        (playPosition.current / track.duration) * barCount - currentBar;
      let colors, breakpoints;
      if (!!hoverPosition.current) {
        const hoverBar = Math.round(hoverPosition.current * barCount);
        if (hoverBar < currentBar) {
          const currentBarColor = rgbaMidpoint(
            unplayedColor,
            selectedColor,
            currentBarRatio
          );
          colors = [playedColor, selectedColor, currentBarColor, unplayedColor];
          breakpoints = [hoverBar, currentBar, currentBar + 1, barCount];
        } else {
          const currentBarColor = rgbaMidpoint(
            selectedColor,
            playedColor,
            currentBarRatio
          );
          colors = [playedColor, currentBarColor, selectedColor, unplayedColor];
          breakpoints = [currentBar, currentBar + 1, hoverBar + 1, barCount];
        }
      } else {
        const currentBarColor = rgbaMidpoint(
          unplayedColor,
          playedColor,
          currentBarRatio
        );
        colors = [playedColor, currentBarColor, unplayedColor];
        breakpoints = [currentBar, currentBar + 1, barCount];
      }
      drawBars(colors, breakpoints);
    }
  }

  function getRatio(e) {
    const { left, right } = canvasElement.current.getBoundingClientRect();
    const ratio = normalize((e.clientX - left) / (right - left));
    return ratio;
  }

  function onClick(e) {
    if (active) {
      jukebox.seek(getRatio(e));
    } else {
      jukebox.play(track);
    }
  }

  return (
    <div className="relative w-min">
      <span
        className={`z-10 text-xs bg-gray-800 text-white text-bold px-0.5 absolute left-0 top-7`}
      >
        {active && jukebox.composeDuration(playTime)}
      </span>
      <canvas
        className="waves cursor-pointer"
        height={height}
        width={width}
        ref={canvasElement}
        onMouseEnter={() => setHover(true)}
        onMouseMove={(e) => (hoverPosition.current = getRatio(e))}
        onMouseLeave={() => {
          setHover(false);
          hoverPosition.current = null;
        }}
        onClick={onClick}
      />
      <span className="z-10 text-xs bg-gray-800 text-white text-bold px-0.5 absolute right-0 top-7">
        {track && jukebox.composeDuration(track.duration)}
      </span>
    </div>
  );
}

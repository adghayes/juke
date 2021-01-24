import Player from "../../components/Player";
import { useRouter } from "next/router";
import Error from "next/error";
import useRect from "../../hooks/useRect";
import useUser from "../../hooks/useUser";
import API from "../../lib/api";
import useSWR from "swr";
import { useEffect, useState } from "react";
import useJukebox from "../../hooks/useJukebox";

const opacityRange = [
  "opacity-0",
  "opacity-5",
  "opacity-10",
  "opacity-20",
  "opacity-30",
  "opacity-40",
  "opacity-50",
  "opacity-60",
  "opacity-70",
  "opacity-80",
  "opacity-90",
  "opacity-95",
  "opacity-100",
];

const bgs = [
  "bg-gradient-to-tl from-pink-400 via-blue-300 to-purple-400 ",
  "bg-gradient-to-tl from-blue-400 via-purple-300 to-pink-400 ",
  "bg-gradient-to-tl from-purple-400 via-pink-300 to-blue-400 ",
];

const bgBaseClass = "absolute inset-0 z-0 transition-opacity duration-2000 ";

export default function TrackPage({}) {
  const router = useRouter();
  const { artistSlug, trackSlug } = router.query;
  const [rect, rectRef] = useRect();
  const jukebox = useJukebox();

  const { user } = useUser();
  const isUser = user && user.slug === artistSlug;

  const [opacities, setOpacities] = useState([12, 0, 0]);
  const [bgActive, setBgActive] = useState(true);

  const trackKey =
    trackSlug && artistSlug && `tracks/${artistSlug}/${trackSlug}`;
  const { data: track, error } = useSWR(trackKey, API.fetch, {
    dedupingInterval: 1000 * 60,
  });

  const smallScreen = rect && rect.width < 640;

  useEffect(() => {
    // posibly hash handling #edit
  }, [isUser]);

  useEffect(() => {
    if (jukebox.playing && bgActive && !smallScreen) {
      const interval = setInterval(() => {
        setOpacities((current) => {
          const outIndex = current.findIndex(
            (x, idx, arr) =>
              x === 12 || (x > 0 && arr[(idx + 1) % arr.length] > 0)
          );
          const inIndex = (outIndex + 1) % current.length;
          const next = current.slice();
          next[outIndex] -= 1;
          next[inIndex] += 1;
          return next;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [jukebox.id, bgActive, smallScreen]);

  if (error) return <Error statusCode={error.status} />;

  return (
    <div
      ref={rectRef}
      className={`relative h-full w-screen flex flex-col justify-center items-center`}
    >
      {track && rect ? (
        <div className="shadow-xl rounded-xl w-max z-10 my-12">
          <Player track={track} maxWidth={rect.width} />
        </div>
      ) : null}
      {!smallScreen && jukebox.playing ? (
        <button
          onClick={() => setBgActive((x) => !x)}
          className="absolute right-4 top-4 z-20 bg-gray-100 rounded-full px-4 py-2 hover:shadow-xl opacity-20 text-xs hover:opacity-100 focus:opacity-100 transition duration-500"
        >
          {bgActive ? "Disable" : "Enable"} Background Animation
        </button>
      ) : null}
      <ul>
        {bgs.map((bg, idx) => (
          <li
            key={idx}
            className={bgBaseClass + bg + opacityRange[opacities[idx]]}
          ></li>
        ))}
      </ul>
    </div>
  );
}

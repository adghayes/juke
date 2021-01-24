import { useMemo } from "react";
import TilePlayer from "./TilePlayer";
import WavePlayer from "./WavePlayer";
import Spinner from "./Spinner";

export default function Player({ track, queue, maxWidth }) {
  const barCount = useMemo(() => determineBars(maxWidth), [maxWidth]);

  function determineBars(maxWidth) {
    if (maxWidth > 1240) {
      return 288;
    } else if (maxWidth > 1080) {
      return 240;
    } else if (maxWidth > 810) {
      return 192;
    } else if (maxWidth > 650) {
      return 144;
    } else if (maxWidth > 560) {
      return 96;
    } else if (maxWidth > 430) {
      return 72;
    } else {
      return 0;
    }
  }

  if (!track) return <Spinner />;
  return barCount ? (
    <WavePlayer track={track} queue={queue} barCount={barCount} />
  ) : (
    <TilePlayer track={track} queue={queue} />
  );
}

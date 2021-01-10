import { getAvatar } from "../lib/thumbnails";
import Player from "./Player";
import TimeAgo from "timeago-react";

export default function FeedItem({ track, queue, width }) {
  const ItemSource = track ? (
    <div className=" flex inline-flex items-center py-2 flex-start self-start text-sm">
      <img
        src={getAvatar(track.owner.avatar)}
        alt="Your user avatar"
        width="24"
        height="24"
        className="rounded-full"
      />
      <span className="px-3">
        {track.owner.display_name + " posted a track "}
        <TimeAgo datetime={track.created} />
        {"..."}
      </span>
    </div>
  ) : (
    <br />
  );

  return (
    <section className="flex flex-col items-center w-full py-4">
      {ItemSource}
      <div className="w-full self-center flex justify-center items-center">
        <Player track={track} queue={queue} maxWidth={width} />
      </div>
    </section>
  );
}

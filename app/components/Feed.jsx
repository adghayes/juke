import Queue from "./Queue";
import { getAvatar } from "../lib/thumbnails";
import TimeAgo from "timeago-react";
import Link from "next/link";

export default function Feed({}) {
  return (
    <Queue
      queueKey="feed"
      disableTileView={true}
      LabelComponent={Attribution}
    />
  );
}

function Attribution({ track }) {
  return (
    <div className=" flex inline-flex items-center py-2 flex-start self-start text-sm">
      <img
        src={getAvatar(track.owner.avatar)}
        alt="Your user avatar"
        width="24"
        height="24"
        className="rounded-full"
      />
      <span className="px-3">
        <Link href={`/${track.owner.slug}`}>
          <a className="hover:underline">{track.owner.display_name}</a>
        </Link>

        <span>{" posted a track "}</span>
        <TimeAgo datetime={track.created} />
        {"..."}
      </span>
    </div>
  );
}

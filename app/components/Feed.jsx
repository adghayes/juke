import Queue from './Queue'
import { getAvatar } from "../lib/thumbnails";
import TimeAgo from "timeago-react";

export default function Feed({}) {
  return <Queue queueKey="feed" disableTileView={true} LabelComponent={Attribution}/>
}

function Attribution({ track }){
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
        {track.owner.display_name + " posted a track "}
        <TimeAgo datetime={track.created} />
        {"..."}
      </span>
    </div>
  )
}    
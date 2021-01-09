import useFeed from "../hooks/useFeed"
import useUser from "../hooks/useUser"
import FeedItem from "../components/FeedItem"


export default function Feed({ width }){
  const { user, loading } = useUser()
  const queue = useFeed(user, loading)

  return (
      <ul className="px-1 flex flex-col items-stretch">
        {queue.tracks.map(track => (
          <li key={track.id}>
            <FeedItem track={track} queue={queue} width={width}/>
          </li>
        ))}
      </ul>
  )
}
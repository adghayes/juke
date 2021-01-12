import { useContext, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import API from "../lib/api";
import { JukeboxContext } from "../pages/_app";

export default function useQueue(key, initialPath) {
  const { data, mutate } = useSWR(key, () => queueFetcher(key, initialPath), {
    dedupingInterval: 1000 * 60 * 60 * 6,
    revalidateOnFocus: false,
  });
  const jukebox = useContext(JukeboxContext).jukebox
  const [length, setLength] = useState(0)

  useEffect(() => {
    if(data){
      setLength(data.tracks.length)
      jukebox.queueAlert(data)
    }
  }, [data && data.tracks.length])

  return data;
}

function queueFetcher(key, path) {
  return API.fetch(path)
  .then((response) => response.json())
  .then((queue) => {
    queue.key = key
    if (queue.next) {
      queue.pushNext = async () => {
        console.log("pushNext");
        return mutate(key, async (queue) => {
          const page = await queueFetcher(key, queue.next);
          const mergedTracks = [...queue.tracks, ...page.tracks]
          return { ...page, tracks: mergedTracks};
        }, false);
      };
    }
    
    return queue;
  });
}

import { useContext, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import API from "../lib/api";
import { JukeContext } from "../pages/_app";

export default function useQueue(key) {
  const { data } = useSWR(key, key => queueFetcher(key, key), {
    dedupingInterval: 1000 * 60 * 60 * 6,
    revalidateOnFocus: false,
  });
  const { jukebox } = useContext(JukeContext)

  useEffect(() => {
    if(data){
      jukebox.queueAlert(data)
    }
  }, [data && data.tracks.length])

  return data;
}

async function queueFetcher(path, key) {
  const queue = await API.fetch(path)
  queue.key = key
  if (queue.next) {
    queue.pushNext = async () => {
      return mutate(key, async (queue) => {
        const page = await queueFetcher(queue.next, key);
        const mergedTracks = [...queue.tracks, ...page.tracks]
        return { ...page, tracks: mergedTracks, key};
      }, false);
    };
  }
  
  return queue;
}

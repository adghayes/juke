import useSWR from "swr";
import API from "../lib/api";

export default function useQueue(key, initialPath) {
  const { data, mutate } = useSWR(key, () => fetcher(initialPath), {
    dedupingInterval: 1000 * 60 * 60 * 6,
    revalidateOnFocus: false,
  });

  function fetcher(path) {
    return API.fetch(path)
      .then((response) => response.json())
      .then((queue) => {
        if (queue.next) {
          queue.pushNext = async () => {
            console.log("pushing next");
            return mutate(async (queue) => {
              const page = await fetcher(queue.next);
              const mergedTracks = [...queue.tracks, ...page.tracks]
              return { ...page, tracks: mergedTracks};
            }, false);
          };
        }
        return queue;
      });
  }

  return data;
}

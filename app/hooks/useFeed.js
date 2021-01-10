import useSWR from "swr";
import API from "../lib/api";

export default function useFeed(id) {
  const key = id && ["feed", id];
  const { data, mutate } = useSWR(key, () => fetcher(API.url("feed")), {
    dedupingInterval: 1000 * 60 * 60 * 6,
    revalidateOnFocus: false,
  });

  function fetcher(url) {
    return fetch(url, {
      headers: API.authHeader(),
    }).then((response) => response.json());
  }

  if (!data) return null;

  const queue = { ...data };

  if (queue.next) {
    queue.pushNext = async () => {
      console.log("pushing next");
      return mutate(async (queue) => {
        const page = await fetcher(queue.next);
        const mutatedQueue = { tracks: [...queue.tracks, ...page.tracks] };
        if (page.next) mutatedQueue.next = page.next;
        return mutatedQueue;
      }, false);
    };
  }

  return queue;
}

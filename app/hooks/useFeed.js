import useSWR from "swr";
import API from "../lib/api";

export default function useFeed(user, loading) {
  const key = ["feed", user && user.id]

  const { data, mutate } = useSWR(key, () => feedFetcher(API.url('feed')), {
    dedupingInterval: 1000 * 60 * 60 * 6,
    revalidateOnFocus: false,
  });

  if (!data) return { tracks: [] };

  const queue = { ...data };

  queue.pushNext = () => {
    mutate(async (queue) => {
      const page = await feedFetcher(queue.more);
      return {
        tracks: [...queue.tracks, ...page.tracks],
        next: page.next
      }
    }, false);
  };

  return queue;
}

function feedFetcher(url) {
  return fetch(url, {
    headers: API.authHeader(),
  }).then((response) => response.json());
}



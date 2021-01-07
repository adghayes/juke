import { mutate } from "swr";
import API from "./api";

export async function postTrack(track) {
  return fetch(API.url("tracks"), {
    method: "POST",
    body: JSON.stringify({ track }),
    headers: API.allHeaders(),
  }).then((response) => response.json());
}

export async function patchTrack(payload, trackId) {
  return fetch(API.url(["tracks", trackId]), {
    method: "PATCH",
    body: JSON.stringify({ track: payload }),
    headers: API.allHeaders(),
  }).then((response) => response.json());
}

export async function notifyUploadSuccess(trackId) {
    return patchTrack({
      event: "uploaded",
      track: { uploaded: true },
    }, trackId)
}  

export async function getTrack(trackId) {
  return fetch(API.url(["tracks", trackId]), {
    headers: API.authHeader(),
  }).then((response) => response.json());
}

async function persistLike(trackId, method) {
    return fetch(API.url(["tracks", trackId, "like"]), {
        method,
        headers: API.authHeader(),
      })
}

export async function like(user, trackId) {
  if (user.likes.includes(trackId)) return;

  const mutatedLikes = user.likes.slice();
  mutatedLikes.push(trackId);
  mutate("user", { ...user, likes: mutatedLikes }, false);
  return persistLike(trackId, 'POST')
}

export async function unlike(user, trackId) {
  if (!user.likes.includes(trackId)) return;

  const mutatedLikes = user.likes.filter((id) => id !== trackId);
  mutate("user", { ...user, likes: mutatedLikes }, false);
  return persistLike(trackId, 'DELETE')
}


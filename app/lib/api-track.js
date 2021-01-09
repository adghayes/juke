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

async function persistLike(track, method) {
    return fetch(API.url(["tracks", track.id, "like"]), {
        method,
        headers: API.authHeader(),
      })
}

export async function like(track) {
  mutate("user", user => {
    const mutatedLikedTrackIds = user.liked_track_ids.slice();
    mutatedLikedTrackIds.push(track.id);
    return { ...user, liked_track_ids: mutatedLikedTrackIds }
  }, false);

  return persistLike(track, 'POST')
}

export async function unlike(track) {
  mutate("user", user => {
    const mutatedLikedTrackIds = user.liked_track_ids.filter(id => id !== track.id);
    return { ...user, liked_track_ids: mutatedLikedTrackIds }
  }, false);

  return persistLike(track, 'DELETE')
}

export async function listen(track){

}


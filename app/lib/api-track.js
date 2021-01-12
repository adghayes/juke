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

// TODO FIX
export async function notifyUploadSuccess(trackId) {
  return fetch(API.url(["tracks", trackId]), {
    method: "PATCH",
    body: JSON.stringify({
      event: "uploaded",
      track: { uploaded: true },
    }),
    headers: API.allHeaders(),
  }).then((response) => response.json());
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

export async function like(user, track) {
  mutate("user", () => {
    const mutatedLikedTrackIds = [track.id, ...user.liked_track_ids];
    return { ...user, liked_track_ids: mutatedLikedTrackIds }
  }, false);

  mutate([user.slug, "likes"], likesQueue => {
    const mutatedLikedTracks = [track, ...likesQueue.tracks]
    return { ...likesQueue, tracks: mutatedLikedTracks }
  }, false)

  return persistLike(track, 'POST')
}

export async function unlike(user, track) {
  mutate("user", () => {
    const mutatedLikedTrackIds = user.liked_track_ids.filter(id => id !== track.id);
    return { ...user, liked_track_ids: mutatedLikedTrackIds }
  }, false);

  mutate([user.slug, "likes"], likesQueue => {
    const mutatedLikedTracks = likesQueue.tracks.filter(liked_track => liked_track.id !== track.id)
    return { ...likesQueue, tracks: mutatedLikedTracks}
  }, false)

  return persistLike(track, 'DELETE')
}

const RECENTS_LENGTH = 10

export async function listen(track){
  mutate("user", user => {
    if(!user || user.recent_track_ids.includes(track.id)) return user

    mutate([user.slug, "history"], historyQueue => {
      const mutatedHistoryTracks = [track, ...historyQueue.tracks]
      return { ...historyQueue, tracks: mutatedHistoryTracks}
    }, false)
      
    const mutatedRecentTrackIds = [track.id, ...user.recent_track_ids]
    if (mutatedRecentTrackIds.length > RECENTS_LENGTH){
      mutatedRecentTrackIds.pop()
    }

    return { ...user, recent_track_ids: mutatedRecentTrackIds}
  }, false)
  
  return fetch(API.url(["tracks", track.id, "listen"]), {
    method: "POST",
    headers: API.authHeader(),
  })
}




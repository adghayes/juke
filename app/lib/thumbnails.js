import API from "./api";

export function defaultAvatar() {
  return "/thumbnail.jpg";
}

export function getAvatar(user) {
  if (user && user.avatar) {
    return API.url(user.avatar);
  } else {
    return defaultAvatar();
  }
}

export function defaultThumbnail() {
  return "/child-mike.jpg";
}

export function getThumbnail(track) {
  if (track && track.thumbnail) {
    return API.url(track.thumbnail);
  } else {
    return defaultThumbnail();
  }
}

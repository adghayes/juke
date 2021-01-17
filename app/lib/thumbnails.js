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

export function getThumbnail(path) {
  if (path) {
    return API.url(path);
  } else {
    return "/child-mike.jpg";
  }
}

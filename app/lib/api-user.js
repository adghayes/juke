import API from "./api";
import { clearToken } from "./auth";
import { mutate } from "swr";

export async function userFetcher(key) {
  const res = await fetch(API.url(key), {
    headers: API.authHeader(),
  });

  switch (res.status) {
    case 200:
      return res.json();
    case 401:
      clearToken();
      throw new Error("invalid session");
    default:
      const error = new Error("unexpected error");
      error.status = res.status;
      throw error;
  }
}

export async function patchUser(id, payload) {
  return fetch(API.url(["users", id]), {
    method: "PATCH",
    body: JSON.stringify({ user: payload }),
    headers: API.allHeaders(),
  })
    .then((response) => response.json())
    .then((user) => {
      mutate("user", user, false);
    });
}

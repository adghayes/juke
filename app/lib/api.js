import { getToken } from "./auth";

const API = {
  BACKEND: process.env.NEXT_PUBLIC_BACKEND,

  authHeader: () => ({ Authorization: "bearer " + getToken() }),

  contentHeader: { "Content-Type": "application/json" },

  allHeaders: () => ({
    ...API.authHeader(),
    ...API.contentHeader,
  }),

  url: (path) => {
    let url;
    if (Array.isArray(path)) {
      url = [API.BACKEND, ...path].join("/");
    } else {
      url = API.BACKEND + "/" + path;
    }
    return url.replace(/(?<!:)\/\//, "/");
  },

  fetch: async (path) => {
    const response = await fetch(API.url(path), {
      headers: API.authHeader(),
    });

    if (!response.ok) {
      const error = new Error(response.statusText);
      error.status = response.status;
      throw error;
    }

    return response.json();
  },
};

export default API;

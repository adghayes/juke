import { getToken } from "./auth";

const API = {
  BACKEND: "http://localhost:3000",

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
};

export default API;

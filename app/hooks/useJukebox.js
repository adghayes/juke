import { useContext } from "react";
import { JukeContext } from "../pages/_app";

export default function useJukebox() {
  return useContext(JukeContext).jukebox;
}

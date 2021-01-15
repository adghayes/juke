import Router from "next/router";
import { useEffect } from "react";
import useUser from "./useUser";

export function redirectUnlessUser(){
    const { loggedOut, user } = useUser();
    useEffect(() => {
      if (loggedOut) {
        Router.replace("/login");
      }
    }, [loggedOut]);

    return user
}

export function redirectIfUser(){
    const { user } = useUser();
    useEffect(() => {
      if (user) {
        Router.replace("/stream");
      }
    }, [user]);
}
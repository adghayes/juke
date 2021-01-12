import Router from "next/router";
import { useEffect } from "react";
import useUser from "./useUser";

export function redirectUnlessUser(){
    const { loggedOut } = useUser();
    useEffect(() => {
      if (loggedOut) {
        Router.replace("/");
      }
    }, [loggedOut]);  
}

export function redirectIfUser(){
    const { user } = useUser();
    useEffect(() => {
      if (user) {
        Router.replace("/stream");
      }
    }, [user]);  
}
import useSWR from "swr";
import { userFetcher } from "../lib/api-user";
import { hasToken } from "../lib/auth";

function likeFetcher(){

}

export default function useLikes() {
    const { data, error, mutate } = useSWR('likes', 
        (key) => (hasToken() ? userFetcher(key) : null), 
        { dedupingInterval: 1000 * 60 });

    const loading = !data && !error && hasToken()
    const loggedOut = !hasToken()

    return {
        loading, mutate, loggedOut,
        user: data
    };
}

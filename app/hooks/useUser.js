import useSWR from "swr";
import { userFetcher } from "../lib/api-user";
import { hasToken } from "../lib/auth";

export default function useUser() {
    const { data, mutate } = useSWR('user', 
        (key) => (hasToken() ? userFetcher(key) : null), 
        { dedupingInterval: 1000 * 60 });

    const loading = !data && hasToken()
    const loggedOut = !hasToken()

    return {
        loading, mutate, loggedOut,
        user: data
    };
}

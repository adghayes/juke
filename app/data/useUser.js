import useSWR from "swr";
import { userFetcher } from "../lib/api-user";
import { hasToken } from "../lib/auth";

export default function useUser() {
    const { data, error } = useSWR(hasToken() ? 'user' : null, userFetcher, {
        shouldRetryOnError: false
    });

    const loading = !data && !error
    const loggedOut = !!error 

    return {
        loading: loading,
        loggedOut: loggedOut,
        user: data,
    };
}

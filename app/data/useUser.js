import useSWR from "swr";
import userFetcher from "../lib/userFetcher";

export default function useUser() {
    const { data, error } = useSWR('user', userFetcher, {
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

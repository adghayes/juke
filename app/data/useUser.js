import useSWR from "swr";
import userFetcher from "../lib/userFetcher";

export default function useUser() {
    const { data, mutate, error } = useSWR('user', userFetcher, {
        shouldRetryOnError: false
    });

    const loading = !data && !error
    const loggedOut = error && !data

    return {
        loggedOut,
        userLoading: loading,
        user: data,
        mutateUser: mutate
    };
}

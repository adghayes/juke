import useSWR from "swr";
import userFetcher from "../lib/userFetcher";

export default function useUser() {
    const { data, mutate, error } = useSWR('user', userFetcher, {
        shouldRetryOnError: false
    });

    return {
        loggedOut: !data,
        user: data,
        mutateUser: mutate
    };
}

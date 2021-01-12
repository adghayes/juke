import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useUser from "../hooks/useUser";
import API from "../lib/api";
import { getAvatar } from "../lib/thumbnails";
import Error from "next/error";
import Queue from "../components/Queue";

const tabs = [
  { id: "tracks", label: "Tracks", condition: () => true },
  { id: "likes", label: "Likes", condition: () => true },
  {
    id: "history",
    label: "Listening History",
    condition: (user, artist) => {
      user && artist && user.id === artist.id;
    },
  },
];

export default function ArtistPage({ ownPage }) {
  const { user, loggedOut, loading: userLoading } = useUser();

  const router = useRouter();
  const { slug } = router.query;
  const artistKey = !slug || ownPage ? null : `users/${slug}`;
  const { data, error, loading: artistLoading } = useSWR(
    artistKey,
    (key) => {
      return API.fetch(key).then((response) => {
        if (!response.ok) {
          const error = new Error(response.statusText);
          error.status = response.status;
          throw error;
        }
        return response.json();
      });
    },
    {
      dedupingInterval: 1000 * 60 * 60,
    }
  );

  const [openTab, setOpenTab] = useState("tracks");

  useEffect(() => {
    if (location.hash) {
      setOpenTab(location.hash.replace("#", ""));
    }
  }, []);

  if (error) return <Error statusCode={error.status} />;

  const artist = ownPage ? user : data;
  const loading = ownPage ? userLoading : artistLoading;

  return (
    <div className="static bg-gradient-to-tl from-green-200 to-purple-300 min-h-screen w-screen">
      <div className="lg:min-w-min max-w-screen-lg xl:max-w-screen-xl mx-auto min-h-screen bg-white flex flex-col sm:flex-row p-4">
        <aside className="pr-4 border-r flex flex-col items-stretch divide-y flex-none">
          <div className="py-4 flex flex-col items-center">
            <img
              src={artist && getAvatar(artist.avatar)}
              alt={artist && `${artist.display_name}'s avatar`}
              className="w-64 h-64 rounded-full shadow"
            />
            <p className="text-xl font-bold text-center py-2">
              {artist && artist.display_name}
            </p>
            <p className="text-center">{artist && artist.bio}</p>
          </div>
          <ul className="text-3xl divide-y border-b text-left">
            {tabs.map((tab) =>
              tab.condition(user, artist) ? (
                <li key={tab.id}>
                  <a
                    href={`#${tab.id}`}
                    className={`block py-2 ${
                      tab.id === openTab ? "text-pink-600 font-bold" : ""
                    }`}
                    onClick={() => setOpenTab(tab.id)}
                  >
                    {tab.label}
                  </a>
                </li>
              ) : null
            )}
          </ul>
        </aside>
        <main className="flex-grow pl-4">
          {artist ? (
            <Queue
              initialPath={`users/${artist.slug}/${openTab}`}
              queueKey={[artist.slug, openTab]}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}

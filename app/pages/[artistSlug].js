import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useUser from "../hooks/useUser";
import API from "../lib/api";
import { getAvatar } from "../lib/thumbnails";
import Error from "next/error";
import Queue from "../components/Queue";

const tabs = [
  { id: "tracks", label: "Tracks", private: false},
  { id: "likes", label: "Likes", private: false },
  { id: "history", label: "Listening History", private: true },
];

export default function ArtistPage({ forceUser }) {
  const router = useRouter();
  const { artistSlug } = router.query;

  const { user } = useUser();
  const isUser = forceUser || (user && user.slug === artistSlug)

  const artistKey = !artistSlug || isUser ? null : `users/${artistSlug}`;
  const { data, error } = useSWR(artistKey, API.fetch,
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
  const artist = isUser ? user : data;

  return (
    <div className="bg-gradient-to-tl from-green-200 to-purple-300 min-h-screen w-screen">
      <div className="lg:min-w-min max-w-screen-lg xl:max-w-screen-xl mx-auto min-h-screen bg-white flex flex-col md:flex-row p-4">
        <aside className="pr-4 border-r flex flex-col items-stretch divide-y flex-none">
          <div className="py-4 flex flex-col items-center">
            <img
              src={artist && getAvatar(artist.avatar)}
              alt={artist && `${artist.display_name}'s avatar`}
              className="w-64 h-64 rounded-full"
            />
            <p className="text-xl font-bold text-center py-2">
              {artist && artist.display_name}
            </p>
            <p className="text-center">{artist && artist.bio}</p>
          </div>
          <ul className="text-3xl divide-y border-b text-left">
            {tabs.map((tab) =>
              !tab.private || isUser ? (
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
            <Queue queueKey={`users/${artist.slug}/${openTab}`} />
          ) : null}
        </main>
      </div>
    </div>
  );
}

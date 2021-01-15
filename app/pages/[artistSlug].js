import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useUser from "../hooks/useUser";
import API from "../lib/api";
import { getAvatar } from "../lib/thumbnails";
import Error from "next/error";
import Queue from "../components/Queue";

const tabs = {
  tracks: { label: "Tracks", private: false, empty: "No tracks posted" },
  likes: {
    label: "Likes",
    private: false,
    empty: "Hmmm... don't like anything?",
  },
  history: {
    label: "Listening History",
    private: true,
    empty: "Not much of a listener!",
  },
};

export default function ArtistPage({ forceUser }) {
  const router = useRouter();
  const { artistSlug } = router.query;

  const { user } = useUser();
  const isUser = forceUser || (user && user.slug === artistSlug);

  const artistKey = !artistSlug || isUser ? null : `users/${artistSlug}`;
  const { data, error } = useSWR(artistKey, API.fetch, {
    dedupingInterval: 1000 * 60 * 60,
  });

  const [openTab, setOpenTab] = useState("tracks");
  useEffect(() => {
    if (location.hash) {
      const hashTab = location.hash.replace("#", "");
      if (Object.keys(tabs).includes(hashTab)) {
        setOpenTab(hashTab);
      }
    }
  }, []);

  if (error) return <Error statusCode={error.status} />;
  const artist = isUser ? user : data;

  return (
    <div className="bg-gradient-to-tl from-green-200 to-purple-300 min-h-screen w-screen">
      <div className="max-w-screen-lg lg:min-w-min xl:max-w-screen-xl mx-auto min-h-screen bg-white flex flex-col md:flex-row md:justify-betewen p-4">
        <aside className="pr-4 md:border-r flex flex-col items-stretch divide-y flex-none">
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
            {Object.entries(tabs).map(([tabId, tabProps]) =>
              !tabProps.private || isUser ? (
                <li key={tabId}>
                  <a
                    href={`#${tabId}`}
                    className={`block py-2 ${
                      tabId === openTab ? "text-pink-600 font-bold" : ""
                    }`}
                    onClick={() => setOpenTab(tabId)}
                  >
                    {tabProps.label}
                  </a>
                </li>
              ) : null
            )}
          </ul>
        </aside>
        <main className="md:pl-4 flex flex-col items-center w-full max-w-full md:w-auto md:flex-grow ">
          {artist ? (
            <Queue
              queueKey={`users/${artist.slug}/${openTab}`}
              emptyMessage={tabs[openTab].empty}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}

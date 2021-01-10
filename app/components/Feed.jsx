import useFeed from "../hooks/useFeed";
import useUser from "../hooks/useUser";
import FeedItem from "../components/FeedItem";
import useRect from "../hooks/useRect";
import { useEffect, useRef, useState } from "react";

export default function Feed({}) {
  const rect = useRect("feed", 500);
  const { user, loading: userLoading } = useUser();
  const queue = useFeed(userLoading ? false : user ? user.id : true);

  const [spinner, setSpinner] = useState(true)
  const loading = useRef(true);
  const feedReady = !!rect && !!queue;

  useEffect(() => {
    if(feedReady){
      loading.current = false
      setSpinner(false)
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(async (entry) => {
            if (entry.isIntersecting && !loading.current && queue.next) {
              loading.current = true
              setSpinner(true)
              await queue.pushNext();
              loading.current = false
              setSpinner(false)
            }
          });
        },
        {
          root: document.querySelector("#view"),
          rootMargin: "0px",
          threshold: 1.0,
        }
      );

      const loadingElement = document.querySelector('#feed-loading')

      observer.observe(loadingElement);

      return () => {
        observer.unobserve(loadingElement);
      };
    }
  }, [feedReady, queue && queue.next])

  return (
    <ul id="feed" className="p-1 flex flex-col w-full items-stretch">
      {feedReady
        ? queue.tracks.map((track) => (
            <li key={track.id}>
              <FeedItem track={track} queue={queue} width={rect.width} />
            </li>
          ))
        : null}

      <li
        key="loading"
        className={`py-8 flex justify-center items-center border-b border-gray-300`}
        id="feed-loading"
      >
        { spinner ? <Spinner /> : null}
      </li>
    </ul>
  );
}

function Spinner() {
  return (
    <div className="spinner rounded-full w-16 h-16 border-8 animate-spin">
      <style jsx>{`
        .spinner {
          border-top-color: rgba(236, 72, 153);
        }
      `}</style>
    </div>
  );
}

import useQueue from "../hooks/useQueue";
import useUser from "../hooks/useUser";
import Player from "../components/Player";
import useRect from "../hooks/useRect";
import { useEffect, useRef, useState } from "react";

export default function Queue({queueKey, intialPath, emptyMessage}) {
  const [rect, rectRef] = useRect(500);
  const { user, loading: userLoading } = useUser();
  const queueKey = userLoading ? null : ['feed', user ? user.id : null]
  const queue = useQueue(queueKey, 'feed');

  const [spinner, setSpinner] = useState(true)
  const loading = useRef(true);

  useEffect(() => {
    if(!!queue){
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
  }, [!!queue, queue && queue.next])

  return (
    <div ref={rectRef} className="p-1 flex flex-col w-full">
     <ul className="flex flex-col">
        {!!queue
          ? queue.tracks.map((track) => (
              <li key={track.id}>
                <Player track={track} queue={queue} maxWidth={rect && rect.width} />
              </li>
            ))
          : null}
      </ul>
      <div className={`py-8 flex justify-center items-center`}
          id="feed-loading"
        >
          { spinner ? <Spinner /> : null}
        </div>
    </div>
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

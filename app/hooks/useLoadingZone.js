import { useEffect, useRef, useState } from "react";
import Spinner from "../components/Spinner";

export default function useLoadingZone(queue) {
  const zone = useRef(null);
  const [spinner, setSpinner] = useState(false);
  const loading = useRef(false);
  const complete = queue && !queue.next;

  function setLoading(val) {
    loading.current = val;
    setSpinner(val);
  }

  useEffect(() => {
    setLoading(!queue);
  }, [!queue]);

  useEffect(() => {
    if (queue && queue.next) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(async (entry) => {
            if (entry.isIntersecting && !loading.current) {
              setLoading(true);
              await queue.pushNext();
              setLoading(false);
            }
          });
        },
        {
          root: document.querySelector("#view"),
          rootMargin: "0px",
          threshold: 1.0,
        }
      );

      observer.observe(zone.current);
      return () => observer.disconnect();
    }
  }, [queue && queue.next]);

  return (
    <div
      ref={zone}
      className={`self-stretch flex flex-col justify-center items-center`}
    >
      {spinner ? <Spinner /> : null}
      {complete ? <div className="w-3/4 h-0.5 my-12 border-t"></div> : null}
    </div>
  );
}

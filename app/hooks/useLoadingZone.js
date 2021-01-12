import { useEffect, useRef, useState } from "react";


export default function useLoadingZone(queue){
  const zone = useRef(null)
  const [spinner, setSpinner] = useState(true)
  const loading = useRef(true);
  const [more, setMore] = useState(true)

  function setLoading(val){
    loading.current = val
    setSpinner(val)
  }

  console.log('queue: ' + queue)
  
  useEffect(() => {
    if(queue){
      setLoading(false)
      if (queue.next){
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(async (entry) => {
              if (entry.isIntersecting && !loading.current) {
                setLoading(true)
                await queue.pushNext();
                setLoading(false)
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
      } else {
        setMore(false)
      }
    }
  }, [queue && queue.next])

  return (
    <div ref={zone} className={`py-12 self-stretch flex flex-col justify-center items-center`}>
      { spinner ? <Spinner /> : null}
      { more ? null : <div className="w-3/4 h-0.5 border"></div> }
    </div>
  )
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

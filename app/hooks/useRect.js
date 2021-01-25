import debounce from "lodash.debounce";
import { useEffect, useRef, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";

export default function useRect(wait) {
  const rectRef = useRef(null);
  const [rect, setRect] = useState(null);
  const debouncedSetRect = debounce(setRect, wait);

  useEffect(() => {
    const element = rectRef.current;
    setRect(element.getBoundingClientRect());

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        debouncedSetRect(entry.contentRect);
      }
    });
    observer.observe(element);

    return () => {
      debouncedSetRect.cancel();
      observer.unobserve(element);
    };
  }, []);

  return [rect, rectRef];
}

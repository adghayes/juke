import debounce from 'lodash.debounce'
import { useEffect, useState } from 'react'

export default function useRect(id, wait){
  const [rect, setRect] = useState(null)
  const debouncedSetRect = debounce(setRect, wait)

  useEffect(() => {
    const element = document.getElementById(id)
    setRect(element.getBoundingClientRect())

    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        debouncedSetRect(entry.contentRect)
      }
    })
    observer.observe(element)

    return () => {
      debouncedSetRect.cancel()
      observer.unobserve(element)
    }
  },[])

  return rect
}
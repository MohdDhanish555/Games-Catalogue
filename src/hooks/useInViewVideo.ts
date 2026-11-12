import { useEffect, useRef, useState } from 'react'

const playingVideos = new Set<HTMLVideoElement>()
const MAX_CONCURRENT = 2

function pauseOldestIfNeeded(next: HTMLVideoElement) {
  if (playingVideos.has(next)) return
  if (playingVideos.size < MAX_CONCURRENT) {
    playingVideos.add(next)
    return
  }
  const oldest = playingVideos.values().next().value
  if (oldest && oldest !== next) {
    oldest.pause()
    playingVideos.delete(oldest)
  }
  playingVideos.add(next)
}

function release(video: HTMLVideoElement) {
  playingVideos.delete(video)
}

export function useInViewVideo(enabled = true) {
  const ref = useRef<HTMLVideoElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || !enabled) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.55)
      },
      { threshold: [0, 0.55, 1] },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [enabled])

  useEffect(() => {
    const node = ref.current
    if (!node || !enabled) return

    if (inView) {
      pauseOldestIfNeeded(node)
      node.muted = true
      const playPromise = node.play()
      if (playPromise) {
        playPromise.catch(() => {
          release(node)
        })
      }
    } else {
      node.pause()
      release(node)
    }

    return () => {
      release(node)
    }
  }, [enabled, inView])

  return { ref, inView }
}

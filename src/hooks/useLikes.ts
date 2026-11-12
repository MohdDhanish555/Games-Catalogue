import { useCallback, useEffect, useRef, useState } from 'react'
import { getLikedIds, toggleLike } from '@/lib/gamesApi'
import { useVisitorId } from '@/hooks/useVisitorId'
import { subscribeToGameLikes } from '@/lib/supabase/likesRealtime'

export type LikeCountListener = (gameId: string, delta: number) => void

export function useLikes() {
  const visitorId = useVisitorId()
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [ready, setReady] = useState(false)
  const listenersRef = useRef(new Set<LikeCountListener>())
  const visitorIdRef = useRef(visitorId)
  visitorIdRef.current = visitorId

  useEffect(() => {
    if (!visitorId) return
    let cancelled = false
    void (async () => {
      try {
        const ids = await getLikedIds(visitorId)
        if (!cancelled) setLikedIds(new Set(ids))
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [visitorId])

  useEffect(() => {
    return subscribeToGameLikes((change) => {
      if (change.visitorId === visitorIdRef.current) return
      listenersRef.current.forEach((listener) => {
        listener(change.gameId, change.delta)
      })
    })
  }, [])

  const subscribeLikeCount = useCallback((listener: LikeCountListener) => {
    listenersRef.current.add(listener)
    return () => {
      listenersRef.current.delete(listener)
    }
  }, [])

  const isLiked = useCallback(
    (gameId: string) => likedIds.has(gameId),
    [likedIds],
  )

  const toggle = useCallback(
    async (
      gameId: string,
      currentCount: number,
    ): Promise<{ liked: boolean; likeCount: number } | null> => {
      if (!visitorId) return null
      const currentlyLiked = likedIds.has(gameId)
      const nextLiked = !currentlyLiked
      const nextCount = Math.max(0, currentCount + (nextLiked ? 1 : -1))

      setLikedIds((prev) => {
        const next = new Set(prev)
        if (nextLiked) next.add(gameId)
        else next.delete(gameId)
        return next
      })

      try {
        const result = await toggleLike(gameId, visitorId, currentlyLiked)
        return { liked: result.liked, likeCount: nextCount }
      } catch {
        setLikedIds((prev) => {
          const next = new Set(prev)
          if (currentlyLiked) next.add(gameId)
          else next.delete(gameId)
          return next
        })
        return null
      }
    },
    [likedIds, visitorId],
  )

  return {
    visitorId,
    likedIds,
    isLiked,
    toggle,
    ready,
    subscribeLikeCount,
  }
}

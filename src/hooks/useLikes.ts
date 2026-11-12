import { useCallback, useEffect, useRef, useState } from 'react'
import { getLikeCount, getLikedIds, toggleLike } from '@/lib/gamesApi'
import { useVisitorId } from '@/hooks/useVisitorId'
import { subscribeToGameLikes } from '@/lib/supabase/likesRealtime'

export type LikeCountListener = (gameId: string, likeCount: number) => void

const REFETCH_DEBOUNCE_MS = 80

export function useLikes() {
  const visitorId = useVisitorId()
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [ready, setReady] = useState(false)
  const listenersRef = useRef(new Set<LikeCountListener>())
  const visitorIdRef = useRef(visitorId)
  const pendingRefetchRef = useRef(new Map<string, ReturnType<typeof setTimeout>>())
  visitorIdRef.current = visitorId

  const notifyLikeCount = useCallback((gameId: string, likeCount: number) => {
    listenersRef.current.forEach((listener) => {
      listener(gameId, likeCount)
    })
  }, [])

  const scheduleLikeCountRefetch = useCallback(
    (gameId: string) => {
      const existing = pendingRefetchRef.current.get(gameId)
      if (existing) clearTimeout(existing)

      const timeout = setTimeout(() => {
        pendingRefetchRef.current.delete(gameId)
        void (async () => {
          try {
            const likeCount = await getLikeCount(gameId)
            notifyLikeCount(gameId, likeCount)
          } catch {
            // Keep current UI count if refetch fails.
          }
        })()
      }, REFETCH_DEBOUNCE_MS)

      pendingRefetchRef.current.set(gameId, timeout)
    },
    [notifyLikeCount],
  )

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
    const unsubscribe = subscribeToGameLikes((change) => {
      // Own toggles already update optimistically; skip to avoid a race.
      if (
        change.visitorId &&
        change.visitorId === visitorIdRef.current
      ) {
        return
      }
      scheduleLikeCountRefetch(change.gameId)
    })

    return () => {
      unsubscribe()
      pendingRefetchRef.current.forEach((timeout) => clearTimeout(timeout))
      pendingRefetchRef.current.clear()
    }
  }, [scheduleLikeCountRefetch])

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

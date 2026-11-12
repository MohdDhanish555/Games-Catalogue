import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { getSupabase, isSupabaseConfigured } from './client'

export type GameLikeCountChange = {
  gameId: string
  likeCount: number
}

type GameLikeCountRow = {
  id?: string
  like_count?: number
}

function parseLikeCountChange(
  payload: RealtimePostgresChangesPayload<GameLikeCountRow>,
): GameLikeCountChange | null {
  if (payload.eventType !== 'UPDATE') return null

  const row = payload.new as GameLikeCountRow | null
  if (!row?.id || typeof row.like_count !== 'number') return null

  return {
    gameId: row.id,
    likeCount: Math.max(0, row.like_count),
  }
}

/** Subscribe to denormalized games.like_count updates (like + unlike). */
export function subscribeToGameLikeCounts(
  onChange: (change: GameLikeCountChange) => void,
): () => void {
  if (!isSupabaseConfigured) return () => {}

  const supabase = getSupabase()
  const channel = supabase
    .channel('game-like-counts')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'games',
      },
      (payload) => {
        const change = parseLikeCountChange(
          payload as RealtimePostgresChangesPayload<GameLikeCountRow>,
        )
        if (change) onChange(change)
      },
    )
    .subscribe()

  return () => {
    void supabase.removeChannel(channel)
  }
}

import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { getSupabase, isSupabaseConfigured } from './client'

export type GameLikeChange = {
  gameId: string
  visitorId: string | null
}

type LikeRow = {
  game_id?: string
  visitor_id?: string
}

function parseChange(
  payload: RealtimePostgresChangesPayload<LikeRow>,
): GameLikeChange | null {
  const row =
    payload.eventType === 'DELETE'
      ? (payload.old as LikeRow | null)
      : (payload.new as LikeRow | null)

  if (!row?.game_id) return null

  return {
    gameId: row.game_id,
    visitorId: row.visitor_id ?? null,
  }
}

export function subscribeToGameLikes(
  onChange: (change: GameLikeChange) => void,
): () => void {
  if (!isSupabaseConfigured) return () => {}

  const supabase = getSupabase()
  const channel = supabase
    .channel('game-likes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'game_likes',
      },
      (payload) => {
        const change = parseChange(
          payload as RealtimePostgresChangesPayload<LikeRow>,
        )
        if (change) onChange(change)
      },
    )
    .subscribe()

  return () => {
    void supabase.removeChannel(channel)
  }
}

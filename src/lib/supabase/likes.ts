import { getSupabase } from './client'

export async function fetchLikedGameIds(visitorId: string): Promise<string[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('game_likes')
    .select('game_id')
    .eq('visitor_id', visitorId)

  if (error) throw error
  return (data ?? []).map((row) => row.game_id as string)
}

export async function likeGame(
  gameId: string,
  visitorId: string,
): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.from('game_likes').insert({
    game_id: gameId,
    visitor_id: visitorId,
  })

  // Unique violation — already liked
  if (error && error.code !== '23505') throw error
}

export async function unlikeGame(
  gameId: string,
  visitorId: string,
): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('game_likes')
    .delete()
    .eq('game_id', gameId)
    .eq('visitor_id', visitorId)

  if (error) throw error
}

import type { Game, GameInput } from '@/types/game'
import { getSupabase } from './client'
import { mapGameRow, toGameInsert } from './mappers'
import type { GameRow } from './types'

export async function fetchGames(): Promise<Game[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('games_with_likes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as GameRow[]).map(mapGameRow)
}

export async function fetchGameById(id: string): Promise<Game | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('games_with_likes')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data ? mapGameRow(data as GameRow) : null
}

export async function createGame(input: GameInput): Promise<Game> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('games')
    .insert(toGameInsert(input))
    .select('*')
    .single()

  if (error) throw error
  return mapGameRow({ ...(data as GameRow), like_count: 0 })
}

export async function updateGame(
  id: string,
  input: GameInput,
  likeCount = 0,
): Promise<Game> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('games')
    .update(toGameInsert(input))
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return mapGameRow({ ...(data as GameRow), like_count: likeCount })
}

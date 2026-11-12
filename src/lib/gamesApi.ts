import {
  addMockGame,
  getAllMockGames,
  getLikedGameIdsMock,
  getMockGameById,
  toggleMockLike,
  updateMockGame,
  visitorHasLikedMock,
} from '@/data/mockGames'
import type { Game, GameFilters, GameInput } from '@/types/game'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import * as remoteGames from '@/lib/supabase/games'
import * as remoteLikes from '@/lib/supabase/likes'

export function usingRemoteData(): boolean {
  return isSupabaseConfigured
}

export async function listGames(): Promise<Game[]> {
  if (usingRemoteData()) return remoteGames.fetchGames()
  return getAllMockGames()
}

export async function getGame(id: string): Promise<Game | null> {
  if (usingRemoteData()) return remoteGames.fetchGameById(id)
  return getMockGameById(id)
}

export async function createGame(input: GameInput): Promise<Game> {
  if (usingRemoteData()) return remoteGames.createGame(input)
  return addMockGame(input)
}

export async function updateGame(
  id: string,
  input: GameInput,
  likeCount = 0,
): Promise<Game> {
  if (usingRemoteData()) return remoteGames.updateGame(id, input, likeCount)
  const updated = updateMockGame(id, input)
  if (!updated) throw new Error('Game not found.')
  return updated
}

export async function getLikedIds(visitorId: string): Promise<string[]> {
  if (!visitorId) return []
  if (usingRemoteData()) return remoteLikes.fetchLikedGameIds(visitorId)
  return getLikedGameIdsMock(visitorId)
}

export async function toggleLike(
  gameId: string,
  visitorId: string,
  currentlyLiked: boolean,
): Promise<{ liked: boolean }> {
  if (usingRemoteData()) {
    if (currentlyLiked) {
      await remoteLikes.unlikeGame(gameId, visitorId)
      return { liked: false }
    }
    await remoteLikes.likeGame(gameId, visitorId)
    return { liked: true }
  }

  const result = toggleMockLike(gameId, visitorId)
  return { liked: result.liked }
}

export async function getLikeCount(gameId: string): Promise<number> {
  if (usingRemoteData()) return remoteLikes.fetchLikeCount(gameId)
  const game = getMockGameById(gameId)
  return game?.likeCount ?? 0
}

export function hasLikedLocal(gameId: string, visitorId: string): boolean {
  if (usingRemoteData()) return false
  return visitorHasLikedMock(gameId, visitorId)
}

export function filterAndSortGames(
  games: Game[],
  filters: GameFilters,
): Game[] {
  const search = filters.search.trim().toLowerCase()

  let result = games.filter((game) => {
    const matchesSearch =
      !search ||
      game.title.toLowerCase().includes(search) ||
      game.description.toLowerCase().includes(search)

    if (filters.browseMode === 'age') {
      return matchesSearch && game.ageGroup === filters.ageGroup
    }
    if (filters.browseMode === 'format') {
      return matchesSearch && game.playFormat === filters.playFormat
    }
    return matchesSearch
  })

  result = [...result].sort((a, b) => {
    if (filters.sort === 'liked') {
      return b.likeCount - a.likeCount || b.createdAt.localeCompare(a.createdAt)
    }
    return b.createdAt.localeCompare(a.createdAt)
  })

  return result
}

export function pickFeaturedGames(games: Game[], limit = 3): Game[] {
  if (games.length === 0) return []
  return [...games]
    .sort(
      (a, b) =>
        b.likeCount - a.likeCount || b.createdAt.localeCompare(a.createdAt),
    )
    .slice(0, limit)
}


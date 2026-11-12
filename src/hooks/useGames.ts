import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLikesContext } from '@/context/LikesContext'
import {
  filterAndSortGames,
  listGames,
  pickFeaturedGames,
} from '@/lib/gamesApi'
import type {
  AgeGroup,
  BrowseMode,
  Game,
  GameFilters,
  PlayFormat,
  SortOption,
} from '@/types/game'

const defaultFilters: GameFilters = {
  search: '',
  browseMode: 'all',
  ageGroup: 'All ages',
  playFormat: 'Group',
  sort: 'recent',
}

export function useGames() {
  const { subscribeLikeCount } = useLikesContext()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<GameFilters>(defaultFilters)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listGames()
      setGames(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    return subscribeLikeCount((gameId, delta) => {
      setGames((prev) =>
        prev.map((game) =>
          game.id === gameId
            ? {
                ...game,
                likeCount: Math.max(0, game.likeCount + delta),
              }
            : game,
        ),
      )
    })
  }, [subscribeLikeCount])

  const filtered = useMemo(
    () => filterAndSortGames(games, filters),
    [games, filters],
  )

  const featured = useMemo(() => pickFeaturedGames(games, 3), [games])

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }, [])

  const setBrowseMode = useCallback((browseMode: BrowseMode) => {
    setFilters((prev) => ({ ...prev, browseMode }))
  }, [])

  const setAgeGroup = useCallback((ageGroup: AgeGroup) => {
    setFilters((prev) => ({ ...prev, ageGroup, browseMode: 'age' }))
  }, [])

  const setPlayFormat = useCallback((playFormat: PlayFormat) => {
    setFilters((prev) => ({ ...prev, playFormat, browseMode: 'format' }))
  }, [])

  const setSort = useCallback((sort: SortOption) => {
    setFilters((prev) => ({ ...prev, sort }))
  }, [])

  const updateGameLocal = useCallback((id: string, patch: Partial<Game>) => {
    setGames((prev) =>
      prev.map((game) => (game.id === id ? { ...game, ...patch } : game)),
    )
  }, [])

  const prependGame = useCallback((game: Game) => {
    setGames((prev) => [game, ...prev])
  }, [])

  return {
    games,
    filtered,
    featured,
    loading,
    error,
    filters,
    setSearch,
    setBrowseMode,
    setAgeGroup,
    setPlayFormat,
    setSort,
    refresh,
    updateGameLocal,
    prependGame,
  }
}

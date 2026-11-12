import { useCallback, useEffect, useState } from 'react'
import { getGame } from '@/lib/gamesApi'
import type { Game } from '@/types/game'

export function useGame(id: string | undefined) {
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!id) {
      setGame(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await getGame(id)
      setGame(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const updateLocal = useCallback((patch: Partial<Game>) => {
    setGame((prev) => (prev ? { ...prev, ...patch } : prev))
  }, [])

  return { game, loading, error, refresh, updateLocal }
}

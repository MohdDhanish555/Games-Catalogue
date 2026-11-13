import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Prefer history back so ScrollRestoration can restore catalogue scroll.
 * Fall back to `/` when this is the first history entry (direct link / refresh).
 */
export function useCatalogueBack() {
  const navigate = useNavigate()

  return useCallback(() => {
    const idx = (window.history.state as { idx?: number } | null)?.idx
    if (typeof idx === 'number' && idx > 0) {
      navigate(-1)
      return
    }
    navigate('/')
  }, [navigate])
}

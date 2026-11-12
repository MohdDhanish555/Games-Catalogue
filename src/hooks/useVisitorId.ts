import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'family-games-visitor-id'

let cachedId: string | null = null
const listeners = new Set<() => void>()

function createId(): string {
  return crypto.randomUUID()
}

function readId(): string {
  if (typeof window === 'undefined') return ''
  if (cachedId) return cachedId

  try {
    const existing = localStorage.getItem(STORAGE_KEY)
    if (existing) {
      cachedId = existing
      return existing
    }
    const next = createId()
    localStorage.setItem(STORAGE_KEY, next)
    cachedId = next
    return next
  } catch {
    const fallback = createId()
    cachedId = fallback
    return fallback
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return readId()
}

function getServerSnapshot() {
  return ''
}

/** Lightweight visitor correlation via localStorage — not authentication. */
export function useVisitorId(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function getVisitorId(): string {
  return readId()
}

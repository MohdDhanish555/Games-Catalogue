import { createContext, useContext, type ReactNode } from 'react'
import { useLikes } from '@/hooks/useLikes'

type LikesContextValue = ReturnType<typeof useLikes>

const LikesContext = createContext<LikesContextValue | null>(null)

export function LikesProvider({ children }: { children: ReactNode }) {
  const value = useLikes()
  return (
    <LikesContext.Provider value={value}>{children}</LikesContext.Provider>
  )
}

export function useLikesContext() {
  const ctx = useContext(LikesContext)
  if (!ctx) {
    throw new Error('useLikesContext must be used within LikesProvider')
  }
  return ctx
}

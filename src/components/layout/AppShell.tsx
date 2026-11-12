import type { ReactNode } from 'react'
import { Heart } from 'lucide-react'

interface AppShellProps {
  header: ReactNode
  children: ReactNode
}

const COPYRIGHT_YEAR = new Date().getFullYear()

export function AppShell({ header, children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      {header}
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-md space-y-1">
              <p className="font-display text-base text-ink">Family Games</p>
              <p className="text-sm leading-relaxed text-muted">
                A living collection of games we play together — shared so every
                gathering can start with something familiar, fun, and ours.
              </p>
            </div>
            <p className="inline-flex items-center gap-1.5 text-sm text-muted">
              <span>Made with</span>
              <Heart className="h-3.5 w-3.5 fill-like text-like" aria-hidden />
              <span>
                by <span className="text-ink">Dhanish</span>
              </span>
            </p>
          </div>
          <p className="text-xs tracking-[0.06em] text-muted/80">
            © {COPYRIGHT_YEAR} Ibrahim · Alimamma Family Collection
          </p>
        </div>
      </footer>
    </div>
  )
}
